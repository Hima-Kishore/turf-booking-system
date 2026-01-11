'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SlotResponse } from '@turf-booking/shared-types';

interface SlotGridProps {
  slots: SlotResponse[];
  onSelectSlot: (slotId: string) => void;
}

export function SlotGrid({ slots, onSelectSlot }: SlotGridProps) {
  if (slots.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No available slots for this date
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {slots.map((slot) => (
        <Card key={slot.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {slot.startTime} - {slot.endTime}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary">
                ₹{slot.price}
              </p>
              <Button
                onClick={() => onSelectSlot(slot.id)}
                className="w-full"
                disabled={slot.isBooked}
              >
                {slot.isBooked ? 'Booked' : 'Book Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}