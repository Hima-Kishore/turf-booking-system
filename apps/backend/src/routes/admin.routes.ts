import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { AdminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const adminController = new AdminController();

router.use(AuthMiddleware.authenticate);
router.use(AdminMiddleware.requireAdmin);

router.get('/dashboard', adminController.getDashboardStats);

router.get('/bookings', adminController.getAllBookings);

router.get('/users', adminController.getAllUsers);

router.get('/turfs', adminController.getAllTurfs);
router.post('/turfs', adminController.createTurf);
router.put('/turfs/:turfId', adminController.updateTurf);
router.delete('/turfs/:turfId', adminController.deleteTurf);

router.post('/courts', adminController.createCourt);
router.put('/courts/:courtId', adminController.updateCourt);
router.delete('/courts/:courtId', adminController.deleteCourt);

router.post('/slots/generate', adminController.generateSlots);

router.get('/revenue', adminController.getRevenueReport);

export default router;