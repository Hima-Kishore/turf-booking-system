'use client';

import { useState } from 'react';
import { useAvailableSlots } from '@/hooks/use-slots';
import { SlotGrid } from '@/components/slot-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Hardcoded for now - we'll make this dynamic later
const COURT_IDS = {
  cricket: '43da664f-fbd4-491f-97c4-832c27368d8d',
  football: '8e543f07-1794-4682-b28b-cf47e340863d',
  badminton: '6623acb5-99b9-4496-9858-a3d901aaa1b5',
};

export default function Home() {
  const [selectedCourt, setSelectedCourt] = useState<string>(COURT_IDS.cricket);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const { data: slots, isLoading, error } = useAvailableSlots(selectedCourt, selectedDate);

  const handleDateChange = (days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const handleSelectSlot = (slotId: string) => {
    console.log('Selected slot:', slotId);
    // We'll implement booking in Phase 3
    alert(`Slot ${slotId} selected! Booking functionality coming in Phase 3.`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Turf Booking System</h1>
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
                variant={selectedCourt === COURT_IDS.cricket ? 'default' : 'outline'}
                onClick={() => setSelectedCourt(COURT_IDS.cricket)}
              >
                🏏 Cricket Court
              </Button>
              <Button
                variant={selectedCourt === COURT_IDS.football ? 'default' : 'outline'}
                onClick={() => setSelectedCourt(COURT_IDS.football)}
              >
                ⚽ Football Court
              </Button>
              <Button
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
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedDate === new Date().toISOString().split('T')[0] ? 'default' : 'outline'}
                onClick={() => handleDateChange(0)}
              >
                Today
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDateChange(1)}
              >
                Tomorrow
              </Button>
              <Button
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
          <h2 className="text-2xl font-semibold mb-4">Available Slots</h2>
          
          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Loading available slots...</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-center text-destructive">
                  Error loading slots: {error.message}
                </p>
              </CardContent>
            </Card>
          )}

          {slots && <SlotGrid slots={slots} onSelectSlot={handleSelectSlot} />}
        </div>
      </div>
    </main>
  );
}