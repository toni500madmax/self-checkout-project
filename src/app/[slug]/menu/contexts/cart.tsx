"use client";

import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

interface ICartProduct extends Pick<Product, "id" | "name"  | "price" | "imageUrl"> {
    quantity: number;
}
 
export interface ICartContent {
    isOpen: boolean;
    products: ICartProduct[];
    toggleCart: () => void;
    addProduct: (product: ICartProduct) => void
}

export const CartContext = createContext<ICartContent>({
    isOpen: false,
    products: [],
    toggleCart: () => { },
    addProduct: () => { },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<ICartProduct[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleCart = () => {
        setIsOpen((prev) => !prev);
    };

  const addProduct = (product: ICartProduct) => {
    const productIsAlreadyInCart = products.some(prevProduct => prevProduct.id === product.id);
    if (!productIsAlreadyInCart) {
      return setProducts(prev => [...prev, product]);
    }

    setProducts(prevProducts => {
      return prevProducts.map(prevProduct => {
        if(prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity
          }
        }
        return prevProduct;
      })
    });
   };

    return (
        <CartContext.Provider
          value={{
            isOpen,
            products,
            toggleCart,
            addProduct
          }}
        >
          {children}
      </CartContext.Provider>
    );
} 