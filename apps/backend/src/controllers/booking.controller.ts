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
      // Validate request body
      const validation = createBookingSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const { userId, slotId } = validation.data;

      // Create booking
      const booking = await this.bookingService.createBooking(userId, slotId);

      return res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully',
      });
    } catch (error) {
      console.error('Error creating booking:', error);

      // Handle known errors
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

      // Unknown error
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create booking',
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
      const { bookingId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'userId is required',
        });
      }

      await this.bookingService.cancelBooking(bookingId, userId);

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