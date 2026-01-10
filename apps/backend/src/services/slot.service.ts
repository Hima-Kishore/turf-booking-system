import { prisma } from '../lib/prisma';

export class SlotService {
  /**
   * Get available slots for a court on a specific date
   */
  async getAvailableSlots(courtId: string, date: string) {
    // Convert date string to Date object (UTC midnight)
    const queryDate = new Date(date + 'T00:00:00.000Z');
    
    // Get today's date (UTC midnight) for comparison
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    // Don't allow booking for past dates
    if (queryDate < today) {
      return [];
    }
    
    const slots = await prisma.slot.findMany({
      where: {
        courtId,
        date: queryDate,
        isBooked: false,
      },
      include: {
        court: {
          select: {
            pricePerHour: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return slots.map((slot) => ({
      id: slot.id,
      courtId: slot.courtId,
      date: slot.date.toISOString().split('T')[0],
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
      price: slot.court.pricePerHour,
    }));
  }

  /**
   * Get all slots (for debugging)
   */
  async getAllSlots() {
    const slots = await prisma.slot.findMany({
      include: {
        court: {
          select: {
            name: true,
            pricePerHour: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
      take: 50,
    });

    return slots.map((slot) => ({
      id: slot.id,
      courtId: slot.courtId,
      courtName: slot.court.name,
      date: slot.date.toISOString().split('T')[0],
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
      price: slot.court.pricePerHour,
    }));
  }
}
