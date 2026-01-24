'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign, XCircle, Star } from 'lucide-react';
import { useCancelBooking } from '@/hooks/use-bookings';
import { ReviewDialog } from './review-dialog';

interface BookingCardProps {
  booking: {
    id: string;
    status: string;
    totalPrice: number;
    paymentStatus: string;
    createdAt: string;
    hasReview: boolean;
    slot: {
      date: string;
      startTime: string;
      endTime: string;
    };
    court: {
      name: string;
      sportType: string;
    };
    turf: {
      id: string;
      name: string;
      address: string;
    };
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  const cancelBooking = useCancelBooking();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const isUpcoming = new Date(booking.slot.date) >= new Date(new Date().setHours(0, 0, 0, 0));
  const isCancelled = booking.status === 'cancelled';
  const canCancel = isUpcoming && !isCancelled;
  const isCompleted = !isUpcoming && !isCancelled;
  const canReview = isCompleted && !booking.hasReview;

  const getStatusBadge = () => {
    if (isCancelled) {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    if (isUpcoming) {
      return <Badge variant="default" className="bg-green-500">Upcoming</Badge>;
    }
    return <Badge variant="secondary">Completed</Badge>;
  };

  const getPaymentBadge = () => {
    if (booking.paymentStatus === 'completed') {
      return <Badge variant="default" className="bg-blue-500">Paid</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <>
      <Card className={isCancelled ? 'opacity-60' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{booking.court.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {booking.court.sportType}
              </p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge()}
              {getPaymentBadge()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.turf.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(booking.slot.date + 'T00:00:00').toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.slot.startTime} - {booking.slot.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>₹{booking.totalPrice}</span>
          </div>

          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-4"
              onClick={() => cancelBooking.mutate(booking.id)}
              disabled={cancelBooking.isPending}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {cancelBooking.isPending ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          )}{canReview && (
            <Button
              variant="default"
              size="sm"
              className="w-full mt-4"
              onClick={() => setReviewDialogOpen(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          )}

          {booking.hasReview && isCompleted && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
              <Star className="h-4 w-4 fill-current" />
              <span>Review submitted</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
          </p>
        </CardContent>
      </Card>

      <ReviewDialog
        booking={canReview ? { id: booking.id, turf: { name: booking.turf.name } } : null}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
      />
    </>);
}