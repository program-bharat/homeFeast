import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import upload from '../../config/multer.js';

import {
    getProfile,
    updateProfile,
    changePassword,
    getMyOrders,
} from './user.controller.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('image'), updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.get('/my-orders', authMiddleware, authorize('user'), getMyOrders);


export default router;
