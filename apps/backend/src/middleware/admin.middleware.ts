import { Request, Response, NextFunction } from 'express';

export class AdminMiddleware {
  static requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const adminEmails = ['admin@turfbooking.com', 'john.doe@example.com'];
    
    if (!adminEmails.includes(req.user.email)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    next();
  }
}