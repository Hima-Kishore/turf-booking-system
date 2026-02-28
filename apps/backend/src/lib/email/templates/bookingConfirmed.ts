import { BookingEmailData } from "@repo/shared-types";
import { baseTemplate, detailRow, ctaButton } from "./base";

export function bookingConfirmedTemplate(data: BookingEmailData): string {
  const content = `
    <h2 style="margin:0 0 4px;color:#111827;font-size:22px;font-weight:700;">Booking Confirmed! 🎉</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi ${data.userName}, your slot is locked in. See you on the turf!</p>

    <!-- Booking Card -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#15803d;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Booking Details</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Booking ID", `#${data.bookingId.slice(-8).toUpperCase()}`)}
        ${detailRow("Venue", data.turfName)}
        ${detailRow("Court", `${data.courtName} · ${data.sport}`)}
        ${detailRow("Date", data.date)}
        ${detailRow("Time", `${data.startTime} – ${data.endTime}`)}
        ${detailRow("Location", `${data.address}, ${data.city}`)}
        ${detailRow("Amount Paid", `₹${data.totalAmount.toLocaleString("en-IN")}`)}
        ${data.cancellationDeadline ? detailRow("Cancel Before", data.cancellationDeadline) : ""}
      </table>
    </div>

    <!-- CTA -->
    ${ctaButton("View My Bookings", `${process.env.FRONTEND_URL || "http://localhost:3000"}/my-bookings`)}

    <!-- Note -->
    <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
      You can cancel up to 24 hours before your slot for a full refund. 
      If you have any issues, reply to this email.
    </p>`;

  return baseTemplate(content, `Your booking at ${data.turfName} on ${data.date} is confirmed!`);
}