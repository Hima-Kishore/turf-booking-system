import { Router } from 'express';
import { SlotController } from '../controllers/slot.controller';

const router = Router();
const slotController = new SlotController();

router.get('/available', slotController.getAvailableSlots);
router.get('/debug', slotController.getAllSlots); // Add this line

export default router;