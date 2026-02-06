import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Type Definitions
interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalTurfs: number;
  totalReviews: number;
  averageRating: number;
  recentBookings: RecentBooking[];
}

interface RecentBooking {
  id: string;
  userName: string;
  userEmail: string;
  turfName: string;
  courtName: string;
  date: string;
  time: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface AdminBooking {
  id: string;
  status: string;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  turf: {
    id: string;
    name: string;
    city: string;
  };
  court: {
    id: string;
    name: string;
    sportType: string;
  };
  slot: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  totalBookings: number;
  totalReviews: number;
}

interface AdminTurf {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  totalCourts: number;
  totalReviews: number;
  averageRating: number;
  createdAt: string;
}

interface CreateTurfData {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

interface CreateCourtData {
  turfId: string;
  name: string;
  sportType: string;
  pricePerHour: number;
}

interface GenerateSlotsData {
  courtId: string;
  startDate: string;
  endDate: string;
  timeSlots: { startTime: string; endTime: string }[];
}

interface RevenueReport {
  totalRevenue: number;
  totalBookings: number;
  revenueByTurf: {
    turfId: string;
    turfName: string;
    totalRevenue: number;
    totalBookings: number;
  }[];
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardStats>('/api/admin/dashboard');
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard stats');
      }
      return response.data!;
    },
  });
}

export function useAdminBookings(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery<AdminBooking[]>({
    queryKey: ['admin', 'bookings', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.status) params.status = filters.status;
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;

      const response = await apiClient.get<AdminBooking[]>('/api/admin/bookings', params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch bookings');
      }
      return response.data || [];
    },
  });
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await apiClient.get<AdminUser[]>('/api/admin/users');
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch users');
      }
      return response.data || [];
    },
  });
}

export function useAdminTurfs() {
  return useQuery<AdminTurf[]>({
    queryKey: ['admin', 'turfs'],
    queryFn: async () => {
      const response = await apiClient.get<AdminTurf[]>('/api/admin/turfs');
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch turfs');
      }
      return response.data || [];
    },
  });
}

export function useCreateTurf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTurfData) => {
      const response = await apiClient.post('/api/admin/turfs', data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create turf');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'turfs'] });
      toast.success('Turf created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create turf', {
        description: error.message,
      });
    },
  });
}

export function useUpdateTurf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ turfId, data }: { turfId: string; data: Partial<CreateTurfData> }) => {
      const response = await apiClient.post(`/api/admin/turfs/${turfId}`, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update turf');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'turfs'] });
      toast.success('Turf updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update turf', {
        description: error.message,
      });
    },
  });
}

export function useDeleteTurf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (turfId: string) => {
      const response = await apiClient.delete(`/api/admin/turfs/${turfId}`);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete turf');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'turfs'] });
      toast.success('Turf deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete turf', {
        description: error.message,
      });
    },
  });
}

export function useCreateCourt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourtData) => {
      const response = await apiClient.post('/api/admin/courts', data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create court');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'turfs'] });
      toast.success('Court created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create court', {
        description: error.message,
      });
    },
  });
}

export function useGenerateSlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateSlotsData) => {
      const response = await apiClient.post('/api/admin/slots/generate', data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate slots');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Slots generated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to generate slots', {
        description: error.message,
      });
    },
  });
}

export function useRevenueReport(filters?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery<RevenueReport>({
    queryKey: ['admin', 'revenue', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;

      const response = await apiClient.get<RevenueReport>('/api/admin/revenue', params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch revenue report');
      }
      return response.data!;
    },
  });
}