import { apiClient } from './api-client';
import type { LoginData, SignupData, AuthResponse, UserProfile } from '@turf-booking/shared-types';

export class AuthAPI {
  static async login(data: LoginData) {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);

    if (!response.success) {
      throw new Error(response.error || 'Login failed');
    }

    return response.data!;
  }

  static async signup(data: SignupData) {
    const response = await apiClient.post<AuthResponse>('/api/auth/signup', data);

    if (!response.success) {
      throw new Error(response.error || 'Signup failed');
    }

    return response.data!;
  }

  static async getProfile(accessToken: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch profile');
    }

    return data.data as UserProfile;
  }

  static async logout() {
    // In JWT, logout is client-side only
    return true;
  }
}