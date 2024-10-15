import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    cuisine: {
        type: String,
        required: [true, "Cuisine is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    imageURL: {
        type: String,
        required: [true, "Image URL is required"],
        default: ""
    },
}, { timestamps: true });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;