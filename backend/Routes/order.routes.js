import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { cancelOrder, getCustomerOrders } from '../Controllers/order.controller.js';

const router = express.Router();

// customer routes
router.get("/", isAuthenticated, getCustomerOrders);
router.put("/:orderId", isAuthenticated, cancelOrder);

export default router;