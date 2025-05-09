"use client";

import { Product } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

interface ICartProduct extends Product {
    quantity: number;
}
 
export interface ICartContent {
    isOpen: boolean;
    products: ICartProduct[];
    toggleCart: () => void;
}

export const CartContext = createContext<ICartContent>({
    isOpen: false,
    products: [],
    toggleCart: () => { },
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<ICartProduct[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleCart = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
    );
}