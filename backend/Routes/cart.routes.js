import express from 'express';
import { getCart, addToCart, removeFromCart, updateQuantity, clearCart  } from '../Controllers/cart.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', isAuthenticated,  getCart)
router.post('/',isAuthenticated, addToCart)
router.delete('/:id',isAuthenticated, removeFromCart)
router.put('/:id',isAuthenticated, updateQuantity)
router.delete('/',isAuthenticated, clearCart)

export default router;
