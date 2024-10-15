import { passwordResetEmailTemplate, passwordResetSuccessEmailTemplate, verificationCodeEmailTemplate, welcomeEmailTemplate } from "./emailTemplates.js";
import { transporter } from "./nodeMailer.js";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        transporter.sendMail({
            from: {
                name: process.env.BRAND_NAME,
                address: process.env.SMTP_EMAIL,
            },
            to: email,
            subject: "Verify Your Email",
            html: verificationCodeEmailTemplate(verificationToken),

        });
    } catch (error) {
        console.log("Error Sending Verification Code", error);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        transporter.sendMail({
            from: {
                name: process.env.BRAND_NAME,
                address: process.env.SMTP_EMAIL,
            },
            to: email,
            subject: `Welcome to ${process.env.BRAND_NAME}`,
            html: welcomeEmailTemplate(name),

        });

    } catch (error) {
        console.log("Error Sending Welcome Email ", error);
    }
}

export const sendPasswordResetEmail = async (email, resetPasswordURL) => {
    try {
        transporter.sendMail({
            from: {
                name: process.env.BRAND_NAME,
                address: process.env.SMTP_EMAIL,
            },
            to: email,
            subject: "Reset Your Password",
            html: passwordResetEmailTemplate(resetPasswordURL)

        });

    } catch (error) {
        console.log("Error Sending Password Reset Email ", error);
    }
}

export const sendPasswordResetSuccessEmail = async (email) => {
    try {
        transporter.sendMail({
            from: {
                name: process.env.BRAND_NAME,
                address: process.env.SMTP_EMAIL,
            },
            to: email,
            subject: `Your ${process.env.BRAND_NAME} password reset successfully`,
            html: passwordResetSuccessEmailTemplate()

        });

    } catch (error) {
        console.log("Error Sending Password Reset Success Email ", error);
    }
}


