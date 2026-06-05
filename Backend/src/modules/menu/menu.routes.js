import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js'
import authorize from '../../middlewares/role.middleware.js'
import upload from '../../config/multer.js'
import {
    getAllMenuItems,
    getMenuItemById,
    getMyCookMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
} from './menu.controller.js';

const router = express.Router();

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.get('/cook/my-menu', authMiddleware, authorize('cook'), getMyCookMenu);
router.post('/', authMiddleware, authorize('cook'), upload.single('image'), createMenuItem);
router.put('/:id', authMiddleware, authorize('cook'), upload.single('image'), updateMenuItem);
router.delete('/:id', authMiddleware, authorize('cook'), deleteMenuItem);
router.put('/:id/toggle', authMiddleware, authorize('cook'), toggleAvailability);

export default router;