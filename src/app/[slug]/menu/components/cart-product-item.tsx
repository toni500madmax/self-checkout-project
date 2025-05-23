import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext, ICartProduct } from "../contexts/cart";

interface CartItemProps {
    product: ICartProduct;
}

const CartProductItem = ({ product }: CartItemProps) => {
    const {decreaseProductQuantity, increaseProductQuantity, removeProduct} = useContext(CartContext);

    return ( 
        <div className="flex items-center justify-between mb-1">
            {/* Esquerda */}
            <div className="relative h-20 w-20 rounded-xl bg-gray-100">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
            </div>
            <div className="space-y-1 flex-1 pl-2">
                {/*
                //* Aqui foi colocado as classes: max-w-[90%], truncate, text-ellipsis.
                //* Essas classes são para evitar que o texto ultrapasse o limite do container.
                //* O texto será cortado e exibido com reticências (...) no final.  
                // */}
                <p className="text-xs max-w-[90%] truncate text-ellipsis">
                    {product.name}
                </p>
                <p className="text-sm font-semibold">
                    {formatCurrency(product.price)}
                </p>
                <div className="flex items-center gap-1 text-center">
                    <Button 
                        className="h-7 w-7 rounded-lg" 
                        variant="outline" 
                        onClick={() => decreaseProductQuantity(product.id)}>
                        <ChevronLeftIcon/>
                    </Button>
                    <p className="w-7 text-xs">
                        { product.quantity }
                        </p>
                    <Button 
                        className="h-7 w-7 rounded-lg" 
                        variant="destructive"
                        onClick={() => increaseProductQuantity(product.id)}>
                        <ChevronRightIcon/>
                    </Button>
                </div>
            </div>
            {/* Botão de deletar item */}
            <Button className="h-7 w-7 rounded-lg" variant="outline"
            onClick={() => removeProduct(product.id)}>
                <TrashIcon/>
            </Button>
        </div>
     );
}
 
export default CartProductItem;