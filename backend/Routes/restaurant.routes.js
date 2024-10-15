import express from 'express';
import { createResaurant, getRestaurant, getRestaurantOrders, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from '../Controllers/restaurant.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/',isAuthenticated, createResaurant);
router.get('/', isAuthenticated, getRestaurant);
router.put('/', isAuthenticated, updateRestaurant);

router.get('/orders', isAuthenticated, getRestaurantOrders);
router.put('/order/:orderId', isAuthenticated, updateOrderStatus);

router.get('/search/:searchText', isAuthenticated, searchRestaurant);
router.get('/:restaurantId', isAuthenticated, getSingleRestaurant);

export default router;