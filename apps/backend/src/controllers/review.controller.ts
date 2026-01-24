import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { z } from 'zod';

const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  /**
   * POST /api/reviews
   */
  createReview = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const validation = createReviewSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const { bookingId, rating, comment } = validation.data;

      const review = await this.reviewService.createReview(
        req.user.userId,
        bookingId,
        rating,
        comment
      );

      return res.status(201).json({
        success: true,
        data: review,
        message: 'Review created successfully',
      });
    } catch (error) {
      console.error('Error creating review:', error);

      if (error instanceof Error) {
        if (
          error.message.includes('not found') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('already exists') ||
          error.message.includes('hasn\'t been completed')
        ) {
          return res.status(400).json({
            success: false,
            error: error.message,
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create review',
      });
    }
  };

  /**
   * GET /api/reviews/turf/:turfId
   */
  getTurfReviews = async (req: Request, res: Response) => {
    try {
      const { turfId } = req.params;

      const reviews = await this.reviewService.getTurfReviews(turfId);

      return res.json({
        success: true,
        data: reviews,
        message: `Found ${reviews.length} reviews`,
      });
    } catch (error) {
      console.error('Error fetching turf reviews:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch reviews',
      });
    }
  };

  /**
   * GET /api/reviews/turf/:turfId/rating
   */
  getTurfRating = async (req: Request, res: Response) => {
    try {
      const { turfId } = req.params;

      const rating = await this.reviewService.getTurfRating(turfId);

      return res.json({
        success: true,
        data: rating,
      });
    } catch (error) {
      console.error('Error fetching turf rating:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch rating',
      });
    }
  };

  /**
   * GET /api/reviews/my
   */
  getMyReviews = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const reviews = await this.reviewService.getUserReviews(req.user.userId);

      return res.json({
        success: true,
        data: reviews,
        message: `Found ${reviews.length} reviews`,
      });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch reviews',
      });
    }
  };

  /**
   * PUT /api/reviews/:reviewId
   */
  updateReview = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const { reviewId } = req.params;
      const validation = updateReviewSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const { rating, comment } = validation.data;

      const review = await this.reviewService.updateReview(
        reviewId,
        req.user.userId,
        rating,
        comment
      );

      return res.json({
        success: true,
        data: review,
        message: 'Review updated successfully',
      });
    } catch (error) {
      console.error('Error updating review:', error);

      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
          return res.status(400).json({
            success: false,
            error: error.message,
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update review',
      });
    }
  };

  /**
   * DELETE /api/reviews/:reviewId
   */
  deleteReview = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const { reviewId } = req.params;

      await this.reviewService.deleteReview(reviewId, req.user.userId);

      return res.json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting review:', error);

      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
          return res.status(400).json({
            success: false,
            error: error.message,
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete review',
      });
    }
  };
}