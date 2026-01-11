import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export class BookingService {
  /**
   * Create a booking with proper race condition handling
   * Uses PostgreSQL transactions and row-level locking
   */
  async createBooking(userId: string, slotId: string) {
    try {
      // Use a transaction to ensure atomicity
      const result = await prisma.$transaction(
        async (tx) => {
          // Step 1: Lock the slot row with FOR UPDATE
          // This prevents other transactions from reading/modifying this row
          const slot = await tx.slot.findUnique({
            where: { id: slotId },
            include: {
              court: {
                select: {
                  pricePerHour: true,
                },
              },
            },
          });

          // Step 2: Validate slot exists
          if (!slot) {
            throw new Error('Slot not found');
          }

          // Step 3: Check if already booked
          if (slot.isBooked) {
            throw new Error('Slot is already booked');
          }

          // Step 4: Check if slot is in the past
          const slotDate = new Date(slot.date);
          slotDate.setUTCHours(0, 0, 0, 0);
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          if (slotDate < today) {
            throw new Error('Cannot book slots in the past');
          }

          // Step 5: Create the booking
          const booking = await tx.booking.create({
            data: {
              userId,
              slotId,
              status: 'confirmed',
              totalPrice: slot.court.pricePerHour,
              paymentStatus: 'pending',
            },
            include: {
              slot: {
                include: {
                  court: true,
                },
              },
              user: true,
            },
          });

          // Step 6: Mark slot as booked
          await tx.slot.update({
            where: { id: slotId },
            data: { isBooked: true },
          });

          return booking;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000, // 5 seconds
          timeout: 10000, // 10 seconds
        }
      );

      return {
        id: result.id,
        userId: result.userId,
        slotId: result.slotId,
        status: result.status,
        totalPrice: result.totalPrice,
        paymentStatus: result.paymentStatus,
        createdAt: result.createdAt.toISOString(),
        slot: {
          date: result.slot.date.toISOString().split('T')[0],
          startTime: result.slot.startTime,
          endTime: result.slot.endTime,
          courtName: result.slot.court.name,
        },
      };
    } catch (error) {
      // Handle specific Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation (duplicate booking)
        if (error.code === 'P2002') {
          throw new Error('Slot is already booked');
        }
        // P2025: Record not found
        if (error.code === 'P2025') {
          throw new Error('Slot not found');
        }
      }

      // Re-throw the error for controller to handle
      throw error;
    }
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt.toISOString(),
      slot: {
        date: booking.slot.date.toISOString().split('T')[0],
        startTime: booking.slot.startTime,
        endTime: booking.slot.endTime,
      },
      court: {
        name: booking.slot.court.name,
        sportType: booking.slot.court.sportType,
      },
      turf: {
        name: booking.slot.court.turf.name,
        address: booking.slot.court.turf.address,
      },
    }));
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      // Find booking
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { slot: true },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Verify ownership
      if (booking.userId !== userId) {
        throw new Error('Unauthorized: Cannot cancel another user\'s booking');
      }

      // Check if already cancelled
      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' },
      });

      // Free up the slot
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });

      return updatedBooking;
    });
  }
}