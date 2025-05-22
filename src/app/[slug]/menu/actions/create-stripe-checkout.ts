"use server";

/* import { headers } from "next/headers"; */
import Stripe from "stripe";

import { ICartProduct } from "../contexts/cart";

interface ICreateStripeCheckoutInput {
  products: ICartProduct[];
  orderId: number;
}

export const createStripeCheckout = async ({
  orderId,
  products,
}: ICreateStripeCheckoutInput) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not defined");
  }

  /* const reqHeaders = await headers();
  const origin = reqHeaders.get("origin") ?? ""; */

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "boleto"],
    mode: "payment",
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
    metadata: {
      orderId,
    },
    line_items: products.map((product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
        unit_amount: parseInt(String(product.price * 100)),
      },
      quantity: product.quantity,
    })),
  });
  return { sessionId: session.id };
};
