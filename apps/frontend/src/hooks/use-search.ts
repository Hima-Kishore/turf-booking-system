import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface SearchFilters {
  city?: string;
  state?: string;
  sportType?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
}

interface TurfSearchResult {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  description: string | null;
  courts: {
    id: string;
    name: string;
    sportType: string;
    pricePerHour: number;
    availableSlotsCount: number;
  }[];
}

interface CityResult {
  city: string;
  state: string;
}

export function useSearchTurfs(filters: SearchFilters) {
  return useQuery({
    queryKey: ['search', 'turfs', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (filters.city) params.city = filters.city;
      if (filters.state) params.state = filters.state;
      if (filters.sportType) params.sportType = filters.sportType;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice.toString();
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice.toString();
      if (filters.date) params.date = filters.date;

      const response = await apiClient.get<TurfSearchResult[]>('/api/search/turfs', params);

      if (!response.success) {
        throw new Error(response.error || 'Failed to search turfs');
      }

      return response.data || [];
    },
    enabled: false, // Only run when explicitly called
  });
}

export function useCities() {
  return useQuery({
    queryKey: ['search', 'cities'],
    queryFn: async () => {
      const response = await apiClient.get<CityResult[]>('/api/search/cities');

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch cities');
      }

      return response.data || [];
    },
  });
}