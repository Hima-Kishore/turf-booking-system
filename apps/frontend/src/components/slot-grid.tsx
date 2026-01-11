'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SlotResponse } from '@turf-booking/shared-types';
import { Clock, IndianRupee } from 'lucide-react';

interface SlotGridProps {
  slots: SlotResponse[];
  onSelectSlot: (slot: SlotResponse) => void;
  isLoading?: boolean;
}

export function SlotGrid({ slots, onSelectSlot, isLoading }: SlotGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">
              No available slots for this date
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try selecting a different date or court
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {slots.map((slot) => (
        <Card
          key={slot.id}
          className={`hover:shadow-lg transition-all ${
            slot.isBooked ? 'opacity-60' : 'hover:scale-105'
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {slot.startTime} - {slot.endTime}
              </CardTitle>
              {slot.isBooked && (
                <Badge variant="destructive" className="text-xs">
                  Booked
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {slot.price}
                </span>
                <span className="text-sm text-muted-foreground">/hour</span>
              </div>
              <Button
                onClick={() => onSelectSlot(slot)}
                className="w-full"
                disabled={slot.isBooked}
                variant={slot.isBooked ? 'secondary' : 'default'}
              >
                {slot.isBooked ? 'Already Booked' : 'Book Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}