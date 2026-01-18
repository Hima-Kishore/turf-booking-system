import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { createBookingSchema } from '@turf-booking/shared-types';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  /**
   * POST /api/bookings
   */
  createBooking = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      // Validate request body (only slotId needed, userId from token)
      const validation = createBookingSchema.safeParse({
        userId: req.user.userId, // Use authenticated user ID
        slotId: req.body.slotId,
      });

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const { userId, slotId } = validation.data;

      const booking = await this.bookingService.createBooking(userId, slotId);

      return res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully',
      });
    } catch (error) {
      console.error('Error creating booking:', error);

      if (error instanceof Error) {
        if (
          error.message.includes('already booked') ||
          error.message.includes('not found') ||
          error.message.includes('past')
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
        message: 'Failed to create booking',
      });
    }
  };

  /**
   * GET /api/bookings/my - Get current user's bookings
   */
  getMyBookings = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const bookings = await this.bookingService.getUserBookings(req.user.userId);

      return res.json({
        success: true,
        data: bookings,
        message: `Found ${bookings.length} bookings`,
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch bookings',
      });
    }
  };

  /**
   * GET /api/bookings/user/:userId
   */
  getUserBookings = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const bookings = await this.bookingService.getUserBookings(userId);

      return res.json({
        success: true,
        data: bookings,
        message: `Found ${bookings.length} bookings`,
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch bookings',
      });
    }
  };

  /**
   * DELETE /api/bookings/:bookingId
   */
  cancelBooking = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const { bookingId } = req.params;

      // Use authenticated user's ID
      await this.bookingService.cancelBooking(bookingId, req.user.userId);

      return res.json({
        success: true,
        message: 'Booking cancelled successfully',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);

      if (error instanceof Error) {
        if (
          error.message.includes('not found') ||
          error.message.includes('Unauthorized') ||
          error.message.includes('already cancelled')
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
        message: 'Failed to cancel booking',
      });
    }
  };
}