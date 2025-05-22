import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is missing");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
  if (!webhookSecret) {
    throw new Error("Stripe webhook secret key is missing");
  }
  const text = await request.text();
  const event = stripe.webhooks.constructEvent(text, signature, webhookSecret);

  const paymentIsSuccessfull = event.type === "checkout.session.completed";
  if (paymentIsSuccessfull) {
    const orderId = event.data.object.metadata?.orderId;
    if (!orderId) {
      return NextResponse.json({
        received: true,
      });
    }
    await db.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        status: "PAYMENT_CONFIRMED",
      },
    });
  }
  return NextResponse.json({
    received: true,
  });
}
