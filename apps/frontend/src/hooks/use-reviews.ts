import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface ReviewData {
  bookingId: string;
  rating: number;
  comment?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface TurfRating {
  averageRating: number;
  totalReviews: number;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviewData) => {
      const response = await apiClient.post('/api/reviews', data);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create review');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review Submitted', {
        description: 'Thank you for your feedback!',
      });
    },
    onError: (error: Error) => {
      toast.error('Review Failed', {
        description: error.message,
      });
    },
  });
}

export function useTurfReviews(turfId: string) {
  return useQuery({
    queryKey: ['reviews', 'turf', turfId],
    queryFn: async () => {
      const response = await apiClient.get<Review[]>(`/api/reviews/turf/${turfId}`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch reviews');
      }

      return response.data || [];
    },
    enabled: !!turfId,
  });
}

export function useTurfRating(turfId: string) {
  return useQuery({
    queryKey: ['reviews', 'turf', turfId, 'rating'],
    queryFn: async () => {
      const response = await apiClient.get<TurfRating>(`/api/reviews/turf/${turfId}/rating`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch rating');
      }

      return response.data!;
    },
    enabled: !!turfId,
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: ['reviews', 'my'],
    queryFn: async () => {
      const response = await apiClient.get('/api/reviews/my');

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch reviews');
      }

      return response.data || [];
    },
  });
}