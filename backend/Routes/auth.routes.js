import express from "express";
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword, updateProfile, checkAuth, refreshToken } from "../Controllers/auth.controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", isAuthenticated, verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetPasswordToken", resetPassword);

router.put("/profile/update", isAuthenticated, updateProfile);

router.get("/check-auth", isAuthenticated, checkAuth);
router.post("/refresh-token", refreshToken);


export default router;
