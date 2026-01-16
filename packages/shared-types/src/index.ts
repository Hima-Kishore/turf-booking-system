// Slot schemas
export {
  slotAvailabilityQuerySchema,
  slotResponseSchema,
  slotsResponseSchema,
  type SlotAvailabilityQuery,
  type SlotResponse,
  type SlotsResponse,
} from './schemas/slot.schema';

// Booking schemas
export {
  createBookingSchema,
  bookingResponseSchema,
  type CreateBookingRequest,
  type BookingResponse,
} from './schemas/booking.schema';

// Common schemas
export {
  apiResponseSchema,
  errorResponseSchema,
  type ApiResponse,
  type ErrorResponse,
} from './schemas/common.schema';

// Auth schemas
export {
  loginSchema,
  signupSchema,
  authResponseSchema,
  userProfileSchema,
  type LoginData,
  type SignupData,
  type AuthResponse,
  type UserProfile,
} from './schemas/auth.schema';