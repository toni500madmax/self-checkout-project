"use client";

import { Product, Restaurant } from "@prisma/client";
import { createContext, ReactNode, useState } from "react";

export interface ICartProduct extends Pick<Product, "id" | "name"  | "price" | "imageUrl"> {
    quantity: number;
}


export interface ICartContent {
    isOpen: boolean;
    products: ICartProduct[];
    toggleCart: () => void;
    addProduct: (product: ICartProduct) => void;
    decreaseProductQuantity: (productId: string) => void;
    increaseProductQuantity: (productId: string) => void;
    removeProduct: (productId: string) => void;
    total: number;
    totalQuantity: number,
    restaurant: Restaurant[]
}

export const CartContext = createContext<ICartContent>({
    isOpen: false,
    products: [],
    toggleCart: () => { },
    addProduct: () => { },
    decreaseProductQuantity: () => { },
    increaseProductQuantity: () => { },
    removeProduct: () => { },
    total: 0,
    totalQuantity: 0,
    restaurant: []
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<ICartProduct[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const restaurant: Restaurant[] = [];

    const total = products.reduce((acc, product)=>{
      return acc + product.price * product.quantity;
    }, 0)

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
  
  const decreaseProductQuantity = (productId: string) => { 
    setProducts(prevProducts => {
      return prevProducts.map(prevProduct => {
        if (prevProduct.id !== productId) {
          return prevProduct;
        }
        if (prevProduct.quantity === 1) { 
          return prevProduct;
        }
        return {
          ...prevProduct,
          quantity: prevProduct.quantity - 1
        }
      })
    })
  }

  const increaseProductQuantity = (productId: string) => {
    setProducts((prevProducts) => {
      return prevProducts.map((prevProduct) => {
        if (prevProduct.id !== productId) {
          return prevProduct;
        }
        return { ...prevProduct, quantity: prevProduct.quantity + 1 };
      });
    });
  };

  const removeProduct = (productId: string) => {
    setProducts((prevProducts)=> prevProducts.filter(product => product.id !== productId));
  }

  const totalQuantity = products.reduce((acc, prod) => {
    return acc + prod.quantity;
  }, 0)
        
    return (
        <CartContext.Provider
          value={{
            isOpen,
            products,
            toggleCart,
            addProduct,
            decreaseProductQuantity,
            increaseProductQuantity,
            removeProduct,
            total,
            totalQuantity,
            restaurant
          }}
        >
          {children}
      </CartContext.Provider>
    );
} 