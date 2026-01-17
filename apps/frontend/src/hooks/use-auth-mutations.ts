import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthAPI } from '@/lib/auth-api';
import { useAuth } from '@/contexts/auth-context';
import type { LoginData, SignupData } from '@turf-booking/shared-types';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginData) => AuthAPI.login(data),
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.user);
      toast.success('Welcome back!', {
        description: `Logged in as ${data.user.name}`,
      });
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error('Login Failed', {
        description: error.message,
      });
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: SignupData) => AuthAPI.signup(data),
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.user);
      toast.success('Account Created!', {
        description: `Welcome, ${data.user.name}!`,
      });
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error('Signup Failed', {
        description: error.message,
      });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => AuthAPI.logout(),
    onSuccess: () => {
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    },
  });
}