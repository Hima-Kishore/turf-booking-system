import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import slotRoutes from './routes/slot.routes';
import bookingRoutes from './routes/booking.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Turf Booking API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 API: http://localhost:${PORT}/api`);
});

export default app;