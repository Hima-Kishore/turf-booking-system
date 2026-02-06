import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { z } from 'zod';

const createTurfSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const createCourtSchema = z.object({
  turfId: z.string().uuid(),
  name: z.string().min(1),
  sportType: z.string().min(1),
  pricePerHour: z.number().positive(),
});

const generateSlotsSchema = z.object({
  courtId: z.string().uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlots: z.array(
    z.object({
      startTime: z.string(),
      endTime: z.string(),
    })
  ),
});

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getDashboardStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.adminService.getDashboardStats();

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };


  getAllBookings = async (req: Request, res: Response) => {
    try {
      const { status, startDate, endDate } = req.query;

      const bookings = await this.adminService.getAllBookings({
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.adminService.getAllUsers();

      return res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };


  getAllTurfs = async (req: Request, res: Response) => {
    try {
      const turfs = await this.adminService.getAllTurfs();

      return res.json({
        success: true,
        data: turfs,
      });
    } catch (error) {
      console.error('Error fetching turfs:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  createTurf = async (req: Request, res: Response) => {
    try {
      const validation = createTurfSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const turf = await this.adminService.createTurf(validation.data);

      return res.status(201).json({
        success: true,
        data: turf,
        message: 'Turf created successfully',
      });
    } catch (error) {
      console.error('Error creating turf:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  updateTurf = async (req: Request, res: Response) => {
    try {
      const { turfId } = req.params;

      const turf = await this.adminService.updateTurf(turfId, req.body);

      return res.json({
        success: true,
        data: turf,
        message: 'Turf updated successfully',
      });
    } catch (error) {
      console.error('Error updating turf:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };


  deleteTurf = async (req: Request, res: Response) => {
    try {
      const { turfId } = req.params;

      await this.adminService.deleteTurf(turfId);

      return res.json({
        success: true,
        message: 'Turf deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting turf:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };


  createCourt = async (req: Request, res: Response) => {
    try {
      const validation = createCourtSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const court = await this.adminService.createCourt(validation.data);

      return res.status(201).json({
        success: true,
        data: court,
        message: 'Court created successfully',
      });
    } catch (error) {
      console.error('Error creating court:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  updateCourt = async (req: Request, res: Response) => {
    try {
      const { courtId } = req.params;

      const court = await this.adminService.updateCourt(courtId, req.body);

      return res.json({
        success: true,
        data: court,
        message: 'Court updated successfully',
      });
    } catch (error) {
      console.error('Error updating court:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  deleteCourt = async (req: Request, res: Response) => {
    try {
      const { courtId } = req.params;

      await this.adminService.deleteCourt(courtId);

      return res.json({
        success: true,
        message: 'Court deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting court:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };


  generateSlots = async (req: Request, res: Response) => {
    try {
      const validation = generateSlotsSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const slots = await this.adminService.generateSlots(validation.data);

      return res.status(201).json({
        success: true,
        data: slots,
        message: `Generated ${slots.length} slots successfully`,
      });
    } catch (error) {
      console.error('Error generating slots:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };


  getRevenueReport = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const report = await this.adminService.getRevenueReport(
        startDate as string,
        endDate as string
      );

      return res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Error fetching revenue report:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}