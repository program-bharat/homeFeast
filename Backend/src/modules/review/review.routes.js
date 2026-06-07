import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import { getCookReviews, addReview, deleteReview } from './review.controller.js';

const router = express.Router();

router.get('/cook/:cookId', getCookReviews);
router.post('/', authMiddleware, authorize('user'), addReview);
router.delete('/:id', authMiddleware, authorize('admin'), deleteReview);

export default router;