import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { BookingResponse, CreateBookingRequest } from '@turf-booking/shared-types';
import { toast } from 'sonner';

// Define the extended booking response type
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
    mutationFn: async (data: CreateBookingRequest) => {
      const response = await apiClient.post<BookingWithSlot>('/api/bookings', data);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create booking');
      }

      return response.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      
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
      } else {
        toast.error('Booking Failed', {
          description: error.message || 'Please try again.',
        });
      }
    },
  });
}

export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', 'user', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/bookings/user/${userId}`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch bookings');
      }

      return response.data || [];
    },
    enabled: !!userId,
  });
}