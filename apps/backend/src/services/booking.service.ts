import { prisma } from '../lib/prisma';

export class BookingService {
  async createBooking(userId: string, slotId: string) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
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

          if (!slot) {
            throw new Error('Slot not found');
          }

          if (slot.isBooked) {
            throw new Error('Slot is already booked');
          }

          const slotDateTime = new Date(slot.date);
          slotDateTime.setUTCHours(parseInt(slot.startTime.split(':')[0]), 0, 0, 0);
          const now = new Date();

          if (slotDateTime < now) {
            throw new Error('Cannot book slots in the past');
          }

          const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
          if (slotDateTime < twoHoursFromNow) {
            throw new Error('Cannot book slots less than 2 hours in advance');
          }

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

          await tx.slot.update({
            where: { id: slotId },
            data: { isBooked: true },
          });

          return booking;
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
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

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
      review: true,
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
    hasReview: !!booking.review,
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
      id: booking.slot.court.turf.id,
      name: booking.slot.court.turf.name,
      address: booking.slot.court.turf.address,
    },
  }));
}

  /**
   * Cancel a booking with 24-hour policy
   */
  async cancelBooking(bookingId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { slot: true },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.userId !== userId) {
        throw new Error('Unauthorized: Cannot cancel another user\'s booking');
      }

      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      const slotDateTime = new Date(booking.slot.date);
      slotDateTime.setUTCHours(parseInt(booking.slot.startTime.split(':')[0]), 0, 0, 0);
      const now = new Date();
      const hoursUntilSlot = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilSlot < 24) {
        throw new Error('Cannot cancel bookings less than 24 hours before the slot time. No refund will be provided.');
      }

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' },
      });

      await tx.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      });

      return updatedBooking;
    });
  }
}