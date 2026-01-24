import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const reviewController = new ReviewController();

// Public routes
router.get('/turf/:turfId', reviewController.getTurfReviews);
router.get('/turf/:turfId/rating', reviewController.getTurfRating);

// Protected routes
router.use(AuthMiddleware.authenticate);
router.post('/', reviewController.createReview);
router.get('/my', reviewController.getMyReviews);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

export default router;