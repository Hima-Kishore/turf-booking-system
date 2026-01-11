import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';

const router = Router();
const bookingController = new BookingController();

// POST /api/bookings - Create a booking
router.post('/', bookingController.createBooking);

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', bookingController.getUserBookings);

// DELETE /api/bookings/:bookingId - Cancel a booking
router.delete('/:bookingId', bookingController.cancelBooking);

export default router;