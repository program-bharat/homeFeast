import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js'
import authorize from '../../middlewares/role.middleware.js'

import {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    approveCook,
    rejectCook,
    getAllOrders,
    getPendingCooks,
} from './admin.controller.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/pending-cooks', getPendingCooks);
router.put('/cooks/:id/approve', approveCook);
router.put('/cooks/:id/reject', rejectCook);
router.get('/orders', getAllOrders);

export default router;