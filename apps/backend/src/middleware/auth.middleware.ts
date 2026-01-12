import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth.utils';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export class AuthMiddleware {
  /**
   * Verify JWT token from Authorization header
   */
  static authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'No token provided',
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify token
      const payload = AuthUtils.verifyAccessToken(token);

      // Attach user to request
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: error instanceof Error ? error.message : 'Invalid token',
      });
    }
  }

  /**
   * Optional authentication - doesn't fail if no token
   */
  static optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = AuthUtils.verifyAccessToken(token);
        req.user = {
          userId: payload.userId,
          email: payload.email,
        };
      }
      next();
    } catch (error) {
      // If token is invalid, just continue without user
      next();
    }
  }
}