'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SlotResponse } from '@turf-booking/shared-types';
import { useCreateBooking } from '@/hooks/use-bookings';

interface BookingDialogProps {
  slot: SlotResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function BookingDialog({
  slot,
  open,
  onOpenChange,
  userId,
}: BookingDialogProps) {
  const createBooking = useCreateBooking();

  if (!slot) return null;

  const handleConfirm = async () => {
    createBooking.mutate(
      {
        userId,
        slotId: slot.id,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Please review your booking details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Date</span>
            <span className="text-sm">
              {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Time</span>
            <Badge variant="secondary">
              {slot.startTime} - {slot.endTime}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Duration</span>
            <span className="text-sm">1 Hour</span>
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">₹{slot.price}</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createBooking.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}