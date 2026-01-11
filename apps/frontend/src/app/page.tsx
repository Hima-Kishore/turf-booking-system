'use client';

import { useState } from 'react';
import { useAvailableSlots } from '@/hooks/use-slots';
import { SlotGrid } from '@/components/slot-grid';
import { BookingDialog } from '@/components/booking-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SlotResponse } from '@turf-booking/shared-types';

// Replace these with actual UUIDs from your database
const COURT_IDS = {
  cricket: '00000000-0000-0000-0000-000000000100',
  football: '00000000-0000-0000-0000-000000000200',
  badminton: '00000000-0000-0000-0000-000000000300',
};

// Hardcoded user ID for now (in Phase 4, we'll add authentication)
const USER_ID = '00000000-0000-0000-0000-000000000001';

export default function Home() {
  const [selectedCourt, setSelectedCourt] = useState<string>(COURT_IDS.cricket);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: slots, isLoading, error } = useAvailableSlots(selectedCourt, selectedDate);

  console.log('🔍 Debug Info:', {
  selectedCourt,
  selectedDate,
  isLoading,
  error: error?.message,
  slotsCount: slots?.length,
  slots,
});

  const handleDateChange = (days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const handleSelectSlot = (slot: SlotResponse) => {
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  const getCourtName = (courtId: string) => {
    if (courtId === COURT_IDS.cricket) return '🏏 Cricket Court';
    if (courtId === COURT_IDS.football) return '⚽ Football Court';
    if (courtId === COURT_IDS.badminton) return '🏸 Badminton Court';
    return 'Court';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Turf Booking System
          </h1>
          <p className="text-muted-foreground">
            Book your favorite sports court with ease
          </p>
        </div>

        {/* Court Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Court</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="lg"
                variant={selectedCourt === COURT_IDS.cricket ? 'default' : 'outline'}
                onClick={() => setSelectedCourt(COURT_IDS.cricket)}
              >
                🏏 Cricket Court
              </Button>
              <Button
                size="lg"
                variant={selectedCourt === COURT_IDS.football ? 'default' : 'outline'}
                onClick={() => setSelectedCourt(COURT_IDS.football)}
              >
                ⚽ Football Court
              </Button>
              <Button
                size="lg"
                variant={selectedCourt === COURT_IDS.badminton ? 'default' : 'outline'}
                onClick={() => setSelectedCourt(COURT_IDS.badminton)}
              >
                🏸 Badminton Court
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap items-center">
              <Button
                size="lg"
                variant={
                  selectedDate === new Date().toISOString().split('T')[0]
                    ? 'default'
                    : 'outline'
                }
                onClick={() => handleDateChange(0)}
              >
                Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleDateChange(1)}
              >
                Tomorrow
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleDateChange(2)}
              >
                Day After
              </Button>
              <div className="flex items-center ml-auto">
                <span className="text-sm font-medium">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Slots */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              Available Slots - {getCourtName(selectedCourt)}
            </h2>
            {slots && slots.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {slots.length} slot{slots.length !== 1 ? 's' : ''} available
              </span>
            )}
          </div>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-center text-destructive">
                  Error loading slots: {error.message}
                </p>
              </CardContent>
            </Card>
          )}

          <SlotGrid
            slots={slots || []}
            onSelectSlot={handleSelectSlot}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        slot={selectedSlot}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={USER_ID}
      />
    </main>
  );
}