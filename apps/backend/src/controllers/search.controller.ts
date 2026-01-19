import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class SearchController {
  /**
   * GET /api/search/turfs
   */
  searchTurfs = async (req: Request, res: Response) => {
    try {
      const { city, state, sportType, minPrice, maxPrice, date } = req.query;

      const where: Record<string, any> = {};

      if (city) {
        where.city = { contains: city as string, mode: 'insensitive' };
      }

      if (state) {
        where.state = { contains: state as string, mode: 'insensitive' };
      }

      const turfs = await prisma.turf.findMany({
        where,
        include: {
          courts: {
            where: {
              ...(sportType && { sportType: sportType as string }),
              ...(minPrice && { pricePerHour: { gte: parseFloat(minPrice as string) } }),
              ...(maxPrice && { pricePerHour: { lte: parseFloat(maxPrice as string) } }),
            },
            include: {
              slots: {
                where: {
                  ...(date && { date: new Date(date as string + 'T00:00:00.000Z') }),
                  isBooked: false,
                },
                take: 5,
              },
            },
          },
        },
      });

      const results = turfs
        .filter((turf) => turf.courts.length > 0)
        .map((turf) => ({
          id: turf.id,
          name: turf.name,
          address: turf.address,
          city: turf.city,
          state: turf.state,
          description: turf.description,
          courts: turf.courts.map((court) => ({
            id: court.id,
            name: court.name,
            sportType: court.sportType,
            pricePerHour: court.pricePerHour,
            availableSlotsCount: court.slots.length,
          })),
        }));

      return res.json({
        success: true,
        data: results,
        message: `Found ${results.length} turfs`,
      });
    } catch (error) {
      console.error('Error searching turfs:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to search turfs',
      });
    }
  };

  /**
   * GET /api/search/cities
   */
  getCities = async (req: Request, res: Response) => {
    try {
      const cities = await prisma.turf.findMany({
        select: {
          city: true,
          state: true,
        },
        distinct: ['city'],
      });

      return res.json({
        success: true,
        data: cities,
      });
    } catch (error) {
      console.error('Error fetching cities:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}