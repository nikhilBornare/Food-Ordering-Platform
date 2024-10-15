import e from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        max: [32, "Name can not be more than 32 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already exist"],
        lowercase: [true, "Email must be lower case"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [6, "Password must have at least 6 characters"]

    },
    contactNumber: {
        type: Number,
        required: [true, "Contact number is required"],
    },
    address: {
        type: String,
        default: "update your address"
    },
    city: {
        type: String,
        default: "update your city"
    },
    pincode: {
        type: Number,
        default: undefined
    },
    country: {
        type: String,
        default: "update your country"
    },
    profilePicture: {
        type: String,
        default: ""

    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    cartItems: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu"
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiresAt: {
        type: Date,
        default: undefined
    },
    verificationToken: {
        type: String,
        default: undefined
    },
    verificationTokenExpiresAt: {
        type: Date,
        default: undefined
    },
    refreshToken: {
        type: String,
        default: undefined
    },
    
    

}, { timestamps: true });


const User = mongoose.model("User", userSchema);

export default User;