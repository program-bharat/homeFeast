import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import { placeOrder, getOrders, getOrderById, cancelOrder } from './order.controller.js';

const router = express.Router();

router.post('/', authMiddleware, authorize('user'), placeOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/cancel', authMiddleware, authorize('user'), cancelOrder);

export default router;