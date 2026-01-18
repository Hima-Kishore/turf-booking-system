import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { BookingResponse, CreateBookingRequest } from '@turf-booking/shared-types';
import { toast } from 'sonner';

// Define extended booking type for history
interface BookingHistoryItem {
  id: string;
  status: string;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  slot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  court: {
    name: string;
    sportType: string;
  };
  turf: {
    name: string;
    address: string;
  };
}

interface BookingWithSlot extends BookingResponse {
  slot: {
    date: string;
    startTime: string;
    endTime: string;
    courtName: string;
  };
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { slotId: string }) => {
      // Only send slotId, userId comes from auth token
      const response = await apiClient.post<BookingWithSlot>('/api/bookings', data);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create booking');
      }

      return response.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast.success('Booking Confirmed!', {
        description: `Slot booked for ${data.slot.date} at ${data.slot.startTime}`,
      });
    },
    onError: (error: Error) => {
      if (error.message.includes('already booked')) {
        toast.error('Slot Already Booked', {
          description: 'Someone just booked this slot. Please choose another time.',
        });
      } else if (error.message.includes('past')) {
        toast.error('Invalid Date', {
          description: 'Cannot book slots in the past.',
        });
      } else if (error.message.includes('Unauthorized')) {
        toast.error('Authentication Required', {
          description: 'Please login to book a slot.',
        });
      } else {
        toast.error('Booking Failed', {
          description: error.message || 'Please try again.',
        });
      }
    },
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: async () => {
      const response = await apiClient.get<BookingHistoryItem[]>('/api/bookings/my');

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch bookings');
      }

      return response.data || [];
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.delete(`/api/bookings/${bookingId}`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel booking');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      
      toast.success('Booking Cancelled', {
        description: 'Your booking has been cancelled successfully.',
      });
    },
    onError: (error: Error) => {
      toast.error('Cancellation Failed', {
        description: error.message || 'Please try again.',
      });
    },
  });
}