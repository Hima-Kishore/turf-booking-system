import { prisma } from '../lib/prisma';

export class AdminService {

  async getDashboardStats() {
    const [
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      totalUsers,
      totalTurfs,
      totalReviews,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.booking.count({ where: { status: 'cancelled' } }),
      prisma.booking.aggregate({
        where: { status: 'confirmed' },
        _sum: { totalPrice: true },
      }),
      prisma.user.count(),
      prisma.turf.count(),
      prisma.review.count(),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          slot: {
            include: {
              court: {
                include: { turf: { select: { name: true } } },
              },
            },
          },
        },
      }),
    ]);

    const averageRating = await prisma.review.aggregate({
      _avg: { rating: true },
    });

    return {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalUsers,
      totalTurfs,
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        userName: booking.user.name,
        userEmail: booking.user.email,
        turfName: booking.slot.court.turf.name,
        courtName: booking.slot.court.name,
        date: booking.slot.date.toISOString().split('T')[0],
        time: `${booking.slot.startTime} - ${booking.slot.endTime}`,
        amount: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
      })),
    };
  }

  async getAllBookings(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
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
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt.toISOString(),
      user: booking.user,
      turf: {
        id: booking.slot.court.turf.id,
        name: booking.slot.court.turf.name,
        city: booking.slot.court.turf.city,
      },
      court: {
        id: booking.slot.court.id,
        name: booking.slot.court.name,
        sportType: booking.slot.court.sportType,
      },
      slot: {
        date: booking.slot.date.toISOString().split('T')[0],
        startTime: booking.slot.startTime,
        endTime: booking.slot.endTime,
      },
    }));
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
      totalBookings: user._count.bookings,
      totalReviews: user._count.reviews,
    }));
  }


  async getAllTurfs() {
    const turfs = await prisma.turf.findMany({
      include: {
        courts: true,
        reviews: true,
        _count: {
          select: {
            courts: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return turfs.map((turf) => {
      const averageRating =
        turf.reviews.length > 0
          ? turf.reviews.reduce((sum, r) => sum + r.rating, 0) / turf.reviews.length
          : 0;

      return {
        id: turf.id,
        name: turf.name,
        city: turf.city,
        state: turf.state,
        address: turf.address,
        totalCourts: turf._count.courts,
        totalReviews: turf._count.reviews,
        averageRating: Number(averageRating.toFixed(1)),
        createdAt: turf.createdAt.toISOString(),
      };
    });
  }


  async createTurf(data: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    description?: string;
    latitude?: number;
    longitude?: number;
  }) {
    const turf = await prisma.turf.create({
      data,
    });

    return turf;
  }


  async updateTurf(
    turfId: string,
    data: {
      name?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      description?: string;
      latitude?: number;
      longitude?: number;
    }
  ) {
    const turf = await prisma.turf.update({
      where: { id: turfId },
      data,
    });

    return turf;
  }

  async deleteTurf(turfId: string) {
    await prisma.turf.delete({
      where: { id: turfId },
    });

    return true;
  }


  async createCourt(data: {
    turfId: string;
    name: string;
    sportType: string;
    pricePerHour: number;
  }) {
    const court = await prisma.court.create({
      data,
    });

    return court;
  }

  async updateCourt(
    courtId: string,
    data: {
      name?: string;
      sportType?: string;
      pricePerHour?: number;
    }
  ) {
    const court = await prisma.court.update({
      where: { id: courtId },
      data,
    });

    return court;
  }

  async deleteCourt(courtId: string) {
    await prisma.court.delete({
      where: { id: courtId },
    });

    return true;
  }


  async generateSlots(data: {
    courtId: string;
    startDate: string;
    endDate: string;
    timeSlots: { startTime: string; endTime: string }[];
  }) {
    const { courtId, startDate, endDate, timeSlots } = data;

    const start = new Date(startDate + 'T00:00:00.000Z');
    const end = new Date(endDate + 'T00:00:00.000Z');

    const createdSlots = [];

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      for (const timeSlot of timeSlots) {
        const slot = await prisma.slot.upsert({
          where: {
            courtId_date_startTime: {
              courtId,
              date: new Date(date),
              startTime: timeSlot.startTime,
            },
          },
          update: {},
          create: {
            courtId,
            date: new Date(date),
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            isBooked: false,
          },
        });
        createdSlots.push(slot);
      }
    }

    return createdSlots;
  }

  async getRevenueReport(startDate?: string, endDate?: string) {
    const where: any = { status: 'confirmed' };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        slot: {
          include: {
            court: {
              include: { turf: true },
            },
          },
        },
      },
    });

    const revenueByTurf = bookings.reduce((acc: any, booking) => {
      const turfId = booking.slot.court.turf.id;
      const turfName = booking.slot.court.turf.name;

      if (!acc[turfId]) {
        acc[turfId] = {
          turfId,
          turfName,
          totalRevenue: 0,
          totalBookings: 0,
        };
      }

      acc[turfId].totalRevenue += booking.totalPrice;
      acc[turfId].totalBookings += 1;

      return acc;
    }, {});

    return {
      totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      totalBookings: bookings.length,
      revenueByTurf: Object.values(revenueByTurf),
    };
  }
}