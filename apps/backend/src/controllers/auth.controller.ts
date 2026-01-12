import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/signup
   */
  signup = async (req: Request, res: Response) => {
    try {
      const validation = signupSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const result = await this.authService.signup(validation.data);

      return res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error('Signup error:', error);

      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to register user',
      });
    }
  };

  /**
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response) => {
    try {
      const validation = loginSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const result = await this.authService.login(validation.data);

      return res.json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof Error && error.message.includes('Invalid email or password')) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to login',
      });
    }
  };

  /**
   * POST /api/auth/refresh
   */
  refreshToken = async (req: Request, res: Response) => {
    try {
      const validation = refreshTokenSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
      }

      const result = await this.authService.refreshToken(validation.data.refreshToken);

      return res.json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      console.error('Refresh token error:', error);

      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        message: error instanceof Error ? error.message : 'Failed to refresh token',
      });
    }
  };

  /**
   * GET /api/auth/profile
   */
  getProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const profile = await this.authService.getProfile(req.user.userId);

      return res.json({
        success: true,
        data: profile,
        message: 'Profile fetched successfully',
      });
    } catch (error) {
      console.error('Get profile error:', error);

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch profile',
      });
    }
  };

  /**
   * POST /api/auth/logout
   */
  logout = async (req: Request, res: Response) => {
    // In JWT, logout is handled client-side by removing tokens
    // Here we just acknowledge the request
    return res.json({
      success: true,
      message: 'Logged out successfully',
    });
  };
}