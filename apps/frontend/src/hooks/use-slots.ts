import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SlotsResponse } from '@turf-booking/shared-types';

export function useAvailableSlots(courtId: string, date: string) {
  return useQuery({
    queryKey: ['slots', 'available', courtId, date],
    queryFn: async () => {
      const response = await apiClient.get<SlotsResponse>('/api/slots/available', {
        courtId,
        date,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch slots');
      }

      return response.data || [];
    },
    enabled: !!courtId && !!date, // Only run if both params exist
  });
}