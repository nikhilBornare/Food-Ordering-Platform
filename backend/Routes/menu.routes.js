import express from 'express';
import { addMenu, deleteMenu, editMenu, getMenus } from '../Controllers/menu.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', isAuthenticated, getMenus);
router.post('/', isAuthenticated, addMenu);
router.put('/:id', isAuthenticated, editMenu);
router.delete('/:id', isAuthenticated, deleteMenu);

export default router;