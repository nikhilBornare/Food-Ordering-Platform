import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryAddress: {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        contact: {
            type: Number,
            required: [true, "Contact number is required"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
        },
        pincode: {
            type: Number,
            required: [true, "Pincode is required"],
        },
    },
    orderItems: [{
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        imageURL: {
            type: String,
            required: [true, "Image URL is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
        },
    }],
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Out For Delivery", "Delivered", "Cancelled"],
        default: "Pending",
    },
    stripeSessionId: {
        type: String,
        required: [true, "Stripe session id is required"],
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;