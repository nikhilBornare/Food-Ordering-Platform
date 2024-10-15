import Order from "../Models/order.model.js";

// customer controller

export const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate("orderItems.menuId", "name price imageURL");
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json({ orders });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = "Cancelled";
        await order.save();
        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });        
    }
 }