import { Request, Response } from 'express';
import { SlotService } from '../services/slot.service';
import { slotAvailabilityQuerySchema } from '@turf-booking/shared-types';

export class SlotController {
  private slotService: SlotService;

  constructor() {
    this.slotService = new SlotService();
  }

  /**
   * GET /api/slots/available
   */
  getAvailableSlots = async (req: Request, res: Response) => {
    try {
      // Validate query parameters
      const validation = slotAvailabilityQuerySchema.safeParse(req.query);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const { courtId, date } = validation.data;

      // Fetch available slots
      const slots = await this.slotService.getAvailableSlots(courtId, date);

      return res.json({
        success: true,
        data: slots,
        message: `Found ${slots.length} available slots`,
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch available slots',
      });
    }
  };
  getAllSlots = async (req: Request, res: Response) => {
    try {
      const slots = await this.slotService.getAllSlots();
      return res.json({
        success: true,
        data: slots,
        message: `Found ${slots.length} total slots in database`,
      });
    } catch (error) {
      console.error('Error fetching all slots:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
    };
}