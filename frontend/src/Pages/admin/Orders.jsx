import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useRestaurantStore } from "@/Stores/useRestaurantStore";
import { useEffect } from "react";

const Orders = () => {
    const { restaurantOrders, getRestaurantOrders, updateOrderStatus } = useRestaurantStore();

    const handleStatusChange = async (id, status) => {
        await updateOrderStatus(id, status);
    };
    useEffect(() => {
        getRestaurantOrders();
    }, [getRestaurantOrders]);
    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">
                Orders Overview
            </h1>
            <div className="space-y-8">
                {restaurantOrders.map((order) => (
                    <div key={order._id} className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row justify-between w-full">
                            <div className="flex flex-col items-start mb-6 sm:mb-0">
                                <p className="text-gray-600 dark:text-gray-400 mt-2 ">Name:
                                    <span className="font-semibold"> {order.deliveryAddress.name}</span>

                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Address:
                                    <span className="font-semibold">    {order.deliveryAddress.address + ", " + order.deliveryAddress.city + ", " + order.deliveryAddress.pincode}
                                    </span>
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Total Amount:
                                    <span className="font-semibold"> ₹{order.totalAmount}
                                    </span>
                                </p>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <div className="block text-sm font-medium dark:text-gray-300 mb-2">
                                    Order Items:
                                    {order.orderItems.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between mt-2">
                                            <div className="flex items-center  w-full">
                                                <img src={item.imageURL} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                                                <p className="text-gray-600 dark:text-gray-400 ml-2">{item.name}</p>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 w-1/4">Qty: {item.quantity}</p>
                                            <p className="text-gray-600 dark:text-gray-400 w-1/4 ">₹{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <Label className="block text-sm font-medium dark:text-gray-300 mb-2">
                                    Order Status
                                </Label>
                                <Select
                                    onValueChange={(newStatus) =>
                                        handleStatusChange(order._id, newStatus)
                                    }
                                    defaultValue={order.status}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {["Pending", "Processing", "Out For Delivery", "Delivered", "Cancelled"].map((status, index) => (
                                                <SelectItem key={index} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;