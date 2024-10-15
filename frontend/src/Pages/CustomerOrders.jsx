import { useOrderStore } from "@/Stores/useOrderStore";
import { useEffect } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";

const CustomerOrders = () => {
  const { customerOrders, getCustomerOrders, cancelOrder } = useOrderStore();
  useEffect(() => {
    getCustomerOrders();
  }, [getCustomerOrders, cancelOrder]);
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">
        Orders Overview
      </h1>
      <div className="space-y-8">
        {customerOrders.map((order) => (
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
              <div className="flex flex-col items-start w-full sm:w-1/4">
                <div className="block text-sm font-medium dark:text-gray-300 mb-2">
                  Order Status: <span className="font-semibold text-orange">{order.status}</span>
                </div>
                {order.status === "Delivered" && (
                  <div className="block text-sm font-medium dark:text-gray-300 mb-2">
                    Delivered At: <span className="font-semibold text-green-500">{moment(order.updatedAt).format('LLL')}</span>
                  </div>
                )}
                {(order.status === "Pending" || order.status === "Processing") && (
                  <Button onClick={() => cancelOrder(order._id)} className="mt-4 bg-orange hover:bg-hoverOrange">Cancel Order</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrders;