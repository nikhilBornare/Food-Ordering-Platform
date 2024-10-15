import User from "../Models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { generateTokens } from "../utils/jwt.js";
import { generateVerificationToken } from "../utils/EmailVerificationToken.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../utils/Emails.js";
import { console } from "node:inspector";

dotenv.config();

export const signup = async (req, res) => {
    try {
        const { fullName, email, password, contactNumber, profilePicture } = req.body;
        if (!fullName || !email || !password || !contactNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (contactNumber.length !== 10) {
            return res.status(400).json({ message: "Invalid Contact Number " });
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "Email already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationToken(); //Generate verification token 

        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            contactNumber: Number(contactNumber),
            profilePicture,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + eval(process.env.OTP_EXPIRES_IN),
        });

        await user.save();

        //Cookie implementation
        const { refreshToken, accessToken } = generateTokens(user._id);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: eval(process.env.REFRESH_TOKEN_COOKIE_MAXAGE),
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: eval(process.env.ACCESS_TOKEN_COOKIE_MAXAGE),
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        });

        user.refreshToken = refreshToken;
        await user.save();
        await sendVerificationEmail(user.email, verificationToken) //Send verification email
        user.password = undefined;
        res.status(201).json({ message: "User Registered Successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //Cookie implementation

        const { refreshToken, accessToken } = generateTokens(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: eval(process.env.REFRESH_TOKEN_COOKIE_MAXAGE),
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: eval(process.env.ACCESS_TOKEN_COOKIE_MAXAGE),
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        });

        if (!user.isVerified) {
            const verificationToken = generateVerificationToken() //Generate verification token
            user.refreshToken = refreshToken;
            user.verificationToken = verificationToken
            user.verificationTokenExpiresAt = Date.now() + eval(process.env.OTP_EXPIRES_IN); 
            await user.save()
            user.password = undefined;
            await sendVerificationEmail(user.email, verificationToken) //Send verification email
            return res.status(200).json({ message: "Email not verified", user });

        }
        user.refreshToken = refreshToken;
        user.lastLogin = Date.now();
        await user.save();
        user.password = undefined;
        res.status(200).json({ message: `Welcome ${user.fullName}`, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { verificationToken } = req.body;
        if (!verificationToken) {
            return res.status(400).json({ message: "Verification Code required" });
        }
        const user = await User.findOne({ _id: req.userId }).select(-"password");
        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }
        if (user.verificationToken !== verificationToken) {
            return res.status(400).json({ message: "Invalid Verification Token" });
        }
        if (user.verificationTokenExpiresAt < Date.now()) {
            return res.status(400).json({ message: "Verification Token expired" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.fullName); //Send welcome email

        user.password = undefined;
        res.status(200).json({ message: "Email Verified Successfully.", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        const resetPasswordToken = randomBytes(20).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = Date.now() + eval(process.env.PASSWORD_RESET_LINK_EXPIRES_IN);
        await user.save();
        //Send email with resetPasswordToken

        const resetPasswordURL = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
        await sendPasswordResetEmail(user.email, resetPasswordURL);

        res.status(200).json({ message: "Reset Password link sent to your email" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const resetPassword = async (req, res) => {
    try {
        const { resetPasswordToken, } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({ resetPasswordToken });
        if (!user) {
            return res.status(400).json({ message: "Invalid Token" });
        }
        if (user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({ message: "Link Expired" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        user.refreshToken = undefined;
        await user.save();

        //Send email to user that password has been reset
        await sendPasswordResetSuccessEmail(user.email);

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({ message: "Password reset successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const logout = async (req, res) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) return res.status(400).json({ message: "User not logged in" });

        const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        if (!decoded) return res.status(400).json({ message: "Invalid token" });

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(400).json({ message: "User not found" });

        user.refreshToken = undefined;
        await user.save();
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({ message: "Logout successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }
        res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, address, city, country, pincode, contactNumber, profilePicture } = req.body;
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        if (profilePicture && profilePicture !== user.profilePicture) {
            console.log("code is running");

            const cloudResponse = await cloudinary.uploader.upload(profilePicture, { folder: "profile_pictures", });
            user.profilePicture = cloudResponse.secure_url || "";
        }

        user.fullName = fullName;
        user.email = email;
        user.address = address;
        user.city = city;
        user.country = country;
        user.pincode = pincode;
        user.contactNumber = contactNumber;

        await user.save();
        res.status(200).json({ message: "Profile Updated Successfully.", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(400).json({ message: "User not logged in" });

        const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET);
        if (!decoded) return res.status(400).json({ message: "Invalid Token" });

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(400).json({ message: "User not found" });

        if (refreshToken !== user.refreshToken) {
            return res.status(400).json({ message: "Invalid token"});
        }

        const { newRefreshToken , accessToken } = generateTokens(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            maxAge: eval(process.env.REFRESH_TOKEN_COOKIE_MAXAGE),
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: eval(process.env.ACCESS_TOKEN_COOKIE_MAXAGE),
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
        });

        res.status(200).json({ message: "Token refreshed successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
