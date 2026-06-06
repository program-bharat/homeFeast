import epxress from "express";
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
} from './cook.controller.js';

const router = epxress.Router();

router.get('/', getAllCooks);
router.get('/:id', getCookProfile);

router.put('/profile', authMiddleware, authorize('cook'), upload.single('image'), updateCookProfile);
router.get('/dashboard/orders', authMiddleware, authorize('cook'), getCookOrders);
router.put('/dashboard/orders/:id', authMiddleware, authorize('cook'), updateOrderStatus);
router.get('/dashboard/earnings', authMiddleware, authorize('cook'), getCookEarnings);

export default router;