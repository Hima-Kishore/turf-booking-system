import { prisma } from '../lib/prisma';

export class ReviewService {
  /**
   * Create a review for a booking
   */
  async createReview(userId: string, bookingId: string, rating: number, comment?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        slot: {
          include: {
            court: {
              include: {
                turf: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized: Cannot review another user\'s booking');
    }

    const slotDate = new Date(booking.slot.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (slotDate >= now) {
      throw new Error('Cannot review a booking that hasn\'t been completed yet');
    }

    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      throw new Error('Review already exists for this booking');
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        turfId: booking.slot.court.turfId,
        bookingId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      user: review.user,
    };
  }

  /**
   * Get reviews for a turf
   */
  async getTurfReviews(turfId: string) {
    const reviews = await prisma.review.findMany({
      where: { turfId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      user: review.user,
    }));
  }

  /**
   * Get average rating for a turf
   */
  async getTurfRating(turfId: string) {
    const result = await prisma.review.aggregate({
      where: { turfId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating,
    };
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(userId: string) {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        turf: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      turf: review.turf,
    }));
  }

  /**
   * Update a review
   */
  async updateReview(reviewId: string, userId: string, rating?: number, comment?: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized: Cannot update another user\'s review');
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      id: updatedReview.id,
      rating: updatedReview.rating,
      comment: updatedReview.comment,
      createdAt: updatedReview.createdAt.toISOString(),
      user: updatedReview.user,
    };
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized: Cannot delete another user\'s review');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return true;
  }
}