import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../contexts/cart";
import CartProductItem from "./cart-product-item";

const CartSheet = () => {
    const { isOpen, toggleCart, products, total } = useContext(CartContext);

    return (
        <>
            <Sheet open={isOpen} onOpenChange={toggleCart}>
                <SheetContent className="w-[80%]">
                    <SheetHeader>
                        <SheetTitle className="text-left">Sacola</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full py-5">
                        <div className="flex-auto">
                            {products.map((product) => (
                                <CartProductItem key={product.id} product={product}/>
                            ))}
                        </div>
                    </div>
                    <Card className="mb-6">
                        <CardContent>
                            <div className="flex justify-between">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="font-semibold text-sm">{ formatCurrency(total)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button className="w-full rounded-full">Finalizar Pedido</Button>
                </SheetContent>
            </Sheet>
        </>
    );
}
 
export default CartSheet;