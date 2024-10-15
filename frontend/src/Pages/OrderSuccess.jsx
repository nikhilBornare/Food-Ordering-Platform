import { useEffect } from "react";

import { IndianRupee } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useOrderStore } from "@/Stores/useOrderStore";
import { useCartStore } from "@/Stores/useCartStore";

const OrderSuccess = () => {
    const { newOrder, getOrderDetails } = useOrderStore();
    const { clearCart } = useCartStore();
    useEffect(() => {
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        getOrderDetails(sessionId);

    }, [getOrderDetails, clearCart]);

    if (!newOrder)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
                    Loading...
                </h1>
            </div>
        );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Order Placed:{" "}
                        <span className="text-green-500">{newOrder._id}</span>
                    </h1>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Order Summary
                    </h2>

                    {newOrder.orderItems.map((item) => (
                        <div key={item._id} className="mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <img
                                        src={item.imageURL}
                                        alt=""
                                        className="w-14 h-14 rounded-md object-cover"
                                    />
                                    <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">
                                        {item.name}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                        <IndianRupee />
                                        <span className="text-lg font-medium">{item.price} x {item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />
                        </div>

                    ))}

                    <Separator className="my-4" />
                    <div className="text-2xl font-bold flex justify-between">
                        <h1 colSpan={5}>Total</h1>
                        <h1 className="text-right">₹{newOrder.totalAmount}</h1>
                    </div>
                </div>
                <Link to="/">
                    <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;