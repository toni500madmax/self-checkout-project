"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useState /* useTransition */ } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createOrder } from "../actions/create-order";
import { createStripeCheckout } from "../actions/create-stripe-checkout";
import { CartContext } from "../contexts/cart";
import { isValidCpf } from "../helpers/cpf";

interface IFinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

//* Server Actions do NextJS são funções assíncronas que podem ser usadas para manipular dados no servidor, mas podem ser chamadas de client-components.

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  cpf: z
    .string()
    .trim()
    .min(1, {
      message: "CPF é obrigatório",
    })
    .refine((value) => isValidCpf(value), {
      message: "CPF inválido",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const FinishOrderDialog = ({ open, onOpenChange }: IFinishOrderDialogProps) => {
  //! const [isPending] = useTransition();

  const [isLoading, setIsLoading] = useState(false);

  const { slug } = useParams<{ slug: string }>();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
    },
    shouldUnregister: true,
  });

  const searchParams = useSearchParams();
  const { products } = useContext(CartContext);

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsLoading(true);
      const consumptionMethod = searchParams.get(
        "consumptionMethod",
      ) as ConsumptionMethod;

      const order = await createOrder({
        consumptionMethod,
        customerCpf: data.cpf,
        customerName: data.name,
        products,
        slug,
      });
      const { sessionId } = await createStripeCheckout({
        orderId: order.id,
        products,
        slug,
        consumptionMethod,
        cpf: data.cpf,
      });
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) return;
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      );
      stripe?.redirectToCheckout({
        sessionId: sessionId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        {/* 
                //* O DrawerTrigger é o botão que abre o Drawer.
                //* Por essemotivo deve ser colocado o asChild para que ele possa aceitar outro botão dentro dele sem que existam um botão dentro de outro, sejam apenas um.
                //* O asChild é uma propriedade que permite que o componente DrawerTrigger seja usado como um filho de outro componente.
                */}
        <DrawerTrigger asChild></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Finalizar pedido</DrawerTitle>
            <DrawerDescription>
              Insira suas informações abaixo para finalizar o seu pedido.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite aqui" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu CPF</FormLabel>
                      <FormControl>
                        <PatternFormat
                          placeholder="Digite aqui"
                          format="###.###.###-##"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DrawerFooter>
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2Icon className="animate-spin" />}
                    Finalizar
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="rounded-full">
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FinishOrderDialog;
