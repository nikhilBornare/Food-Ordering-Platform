import express from "express";
import { checkoutSuccess, createCheckoutSession } from "../Controllers/payment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create-checkout-session",isAuthenticated, createCheckoutSession);
router.post("/checkout-success",isAuthenticated, checkoutSuccess);


export default router;