'use client';

import { StarRating } from './star-rating';
import { useTurfRating } from '@/hooks/use-reviews';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, IndianRupee } from 'lucide-react';

interface TurfCardProps {
  turf: {
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
  };
}

export function TurfCard({ turf }: TurfCardProps) {
  const router = useRouter();
  const { data: ratingData } = useTurfRating(turf.id);

  const totalAvailableSlots = turf.courts.reduce(
    (sum, court) => sum + court.availableSlotsCount,
    0
  );

  const minPrice = Math.min(...turf.courts.map((c) => c.pricePerHour));
  const maxPrice = Math.max(...turf.courts.map((c) => c.pricePerHour));

  const uniqueSports = [...new Set(turf.courts.map((c) => c.sportType))];

  const handleViewCourts = () => {
    router.push(`/?turfId=${turf.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{turf.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>{turf.city}, {turf.state}</span>
            </div>
          </div>
          {totalAvailableSlots > 0 && (
            <Badge variant="default" className="bg-green-500">
              {totalAvailableSlots} Slots
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        {turf.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {turf.description}
          </p>
        )}

        {/* Rating */}
        {ratingData && ratingData.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={ratingData.averageRating} showNumber />
            <span className="text-xs text-muted-foreground">
              ({ratingData.totalReviews} review{ratingData.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Address */}
        <p className="text-sm">{turf.address}</p>

        {/* Sport Types */}
        <div className="flex flex-wrap gap-2">
          {uniqueSports.map((sport) => (
            <Badge key={sport} variant="outline" className="capitalize">
              {sport === 'cricket' && '🏏'}
              {sport === 'football' && '⚽'}
              {sport === 'badminton' && '🏸'}
              {' '}
              {sport}
            </Badge>
          ))}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-2 text-sm">
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">
            ₹{minPrice} - ₹{maxPrice}
          </span>
          <span className="text-muted-foreground">/hour</span>
        </div>

        {/* Courts Info */}
        <div className="text-sm text-muted-foreground">
          {turf.courts.length} court{turf.courts.length !== 1 ? 's' : ''} available
        </div>

        {/* Action Button */}
        <Button
          onClick={handleViewCourts}
          className="w-full"
          disabled={totalAvailableSlots === 0}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {totalAvailableSlots > 0 ? 'View Courts & Book' : 'No Slots Available'}
        </Button>
      </CardContent>
    </Card>
  );
}