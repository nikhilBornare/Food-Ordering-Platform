import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantName: {
        type: String,
        required: [true, "Restaurant name is required"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    deliveryTime: {
        type: Number,
        required: [true, "Delivery time is required"],
    },
    cuisines: [{
        type: String,
        required: [true, "Cuisine is required"],
    }],
    menus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
    }],
    imageURL: {
        type: String,
        required: [true, "Image URL is required"],
        default: ""
    },

}, { timestamps: true });


const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;