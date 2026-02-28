import { BookingEmailData } from "@repo/shared-types";
import { baseTemplate, detailRow, ctaButton } from "./base";

export function bookingReminderTemplate(data: BookingEmailData): string {
  const content = `
    <h2 style="margin:0 0 4px;color:#111827;font-size:22px;font-weight:700;">Your game is tomorrow! ⏰</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi ${data.userName}, just a reminder about your upcoming booking.</p>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#d97706;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Upcoming Booking</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Venue", data.turfName)}
        ${detailRow("Court", `${data.courtName} · ${data.sport}`)}
        ${detailRow("Date", data.date)}
        ${detailRow("Time", `${data.startTime} – ${data.endTime}`)}
        ${detailRow("Address", `${data.address}, ${data.city}`)}
      </table>
    </div>

    <!-- Tips -->
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 10px;color:#374151;font-size:14px;font-weight:600;">Quick Tips:</p>
      <ul style="margin:0;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8;">
        <li>Arrive 10 minutes early</li>
        <li>Bring water and appropriate footwear</li>
        <li>Show this email at the front desk if needed</li>
      </ul>
    </div>

    ${ctaButton("View Booking Details", `${process.env.FRONTEND_URL || "http://localhost:3000"}/my-bookings`)}`;

  return baseTemplate(content, `Reminder: ${data.sport} at ${data.turfName} tomorrow at ${data.startTime}`);
}