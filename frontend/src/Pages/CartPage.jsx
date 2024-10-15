import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CheckoutConfirmDialoge from "@/components/CheckoutConfirmDialogue";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table";

import { useEffect, useState } from "react";
import { useCartStore } from "@/Stores/useCartStore";

const CartPage = () => {
    const [open, setOpen] = useState(false);
    const { cart, getCart, updateQuantity, removeFromCart, clearCart } = useCartStore();

    const updateQuantityHandler = (id, newQuantity) => {
        if (newQuantity >= 1) {
            updateQuantity(id, newQuantity);
        }
    };

    let totalAmount = cart.reduce((acc, ele) => {
        return acc + ele.price * ele.quantity;
    }, 0);

    useEffect(() => {
        getCart();
    }, [getCart]);

    return (
        <div className="flex flex-col max-w-7xl mx-auto my-10">
            {cart.length === 0 ? (
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
                </div>
            )
                : (<>
                    <div className="flex justify-end">
                        <Button onClick={() => clearCart()} variant="link">Clear All</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Items</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Remove</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-start">
                            {cart.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={item.imageURL} alt="" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>₹{item.price}</TableCell>
                                    <TableCell>
                                        <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                                            <Button
                                                onClick={() => updateQuantityHandler(item._id, item.quantity - 1)}
                                                size={"icon"}
                                                variant={"outline"}
                                                className="rounded-full bg-gray-400"
                                                disabled={item.quantity === 1}
                                            >
                                                <Minus />
                                            </Button>
                                            <Button
                                                size={"icon"}
                                                className="font-bold border-none"
                                                disabled
                                                variant={"outline"}
                                            >
                                                {item.quantity}
                                            </Button>
                                            <Button
                                                onClick={() => updateQuantityHandler(item._id, item.quantity + 1)}
                                                size={"icon"}
                                                className="rounded-full bg-orange hover:bg-hoverOrange"
                                                variant={"outline"}
                                            >
                                                <Plus />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{item.price * item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => removeFromCart(item._id)} size={"sm"} className="bg-orange hover:bg-hoverOrange">
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="text-2xl font-bold">
                                <TableCell colSpan={5}>Total</TableCell>
                                <TableCell className="text-right">₹{totalAmount}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex justify-end my-5">
                        <Button
                            onClick={() => setOpen(true)}
                            className="bg-orange hover:bg-hoverOrange"
                        >
                            Proceed To Checkout
                        </Button>
                    </div>
                    <CheckoutConfirmDialoge open={open} setOpen={setOpen} />
                </>)}
        </div>
    );
};

export default CartPage;
