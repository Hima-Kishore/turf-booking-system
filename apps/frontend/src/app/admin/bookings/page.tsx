'use client';

import { useState } from 'react';
import { useAdminBookings } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminBookingsPage() {
  const [status, setStatus] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: bookings, isLoading, refetch } = useAdminBookings({
    status,
    startDate,
    endDate,
  });

  const handleFilter = () => {
    refetch();
  };

  const handleReset = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Bookings</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="invisible">Actions</Label>
                <div className="flex gap-2">
                  <Button onClick={handleFilter} className="flex-1">
                    Filter
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {bookings?.length || 0} Booking{bookings?.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8">Loading bookings...</p>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{booking.user.name}</p>
                          <Badge
                            variant={
                              booking.status === 'confirmed' ? 'default' : 'destructive'
                            }
                          >
                            {booking.status}
                          </Badge>
                          <Badge
                            variant={
                              booking.paymentStatus === 'completed'
                                ? 'default'
                                : 'outline'
                            }
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {booking.user.email} • {booking.user.phone}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">{booking.turf.name}</span> -{' '}
                          {booking.court.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.slot.date + 'T00:00:00').toLocaleDateString()} •{' '}
                          {booking.slot.startTime} - {booking.slot.endTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{booking.totalPrice}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No bookings found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}