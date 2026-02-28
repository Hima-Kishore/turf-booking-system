import type { BookingEmailData } from "@repo/shared-types";
import { format } from "date-fns";

export function buildBookingEmailData(booking: {
  id: string;
  totalAmount: number;
  user: { name: string; email: string };
  slot: {
    startTime: Date;
    endTime: Date;
    court: {
      name: string;
      sport: string;
      turf: {
        name: string;
        city: string;
        address: string;
      };
    };
  };
}): BookingEmailData {
  const { slot } = booking;
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);

  const cancellationDeadline = new Date(start.getTime() - 24 * 60 * 60 * 1000);

  return {
    bookingId: booking.id,
    userName: booking.user.name,
    userEmail: booking.user.email,
    turfName: slot.court.turf.name,
    courtName: slot.court.name,
    sport: slot.court.sport,
    city: slot.court.turf.city,
    address: slot.court.turf.address,
    date: format(start, "EEEE, d MMMM yyyy"),          
    startTime: format(start, "h:mm a"),
    endTime: format(end, "h:mm a"), 
    totalAmount: booking.totalAmount,
    cancellationDeadline: format(cancellationDeadline, "d MMM yyyy, h:mm a"),
  };
}