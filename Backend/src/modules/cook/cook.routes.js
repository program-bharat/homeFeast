import express from "express"; 
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import upload from "../../config/multer.js";

import {
    getAllCooks,
    getCookProfile,
    updateCookProfile,
    getCookOrders,
    updateOrderStatus,
    getCookEarnings,
    getCookDashboardStats 
} from './cook.controller.js';

const router = express.Router();

router.get('/', getAllCooks);
router.put('/profile', authMiddleware, authorize('cook'), upload.single('image'), updateCookProfile);
router.get('/dashboard/orders', authMiddleware, authorize('cook'), getCookOrders);
router.put('/dashboard/orders/:id', authMiddleware, authorize('cook'), updateOrderStatus);
router.get('/dashboard/earnings', authMiddleware, authorize('cook'), getCookEarnings);
router.get('/dashboard/stats', authMiddleware, authorize('cook'), getCookDashboardStats); 

router.get('/:id', getCookProfile);

export default router;