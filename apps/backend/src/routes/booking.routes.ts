import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const bookingController = new BookingController();

// All booking routes require authentication
router.use(AuthMiddleware.authenticate);

// POST /api/bookings - Create a booking
router.post('/', bookingController.createBooking);

// GET /api/bookings/my - Get current user's bookings
router.get('/my', bookingController.getMyBookings);

// GET /api/bookings/user/:userId - Get user's bookings (kept for compatibility)
router.get('/user/:userId', bookingController.getUserBookings);

// DELETE /api/bookings/:bookingId - Cancel a booking
router.delete('/:bookingId', bookingController.cancelBooking);

export default router;