import { BookingEmailData } from "@repo/shared-types";
import { baseTemplate, detailRow } from "./base";

export function bookingCancelledTemplate(data: BookingEmailData): string {
  const content = `
    <h2 style="margin:0 0 4px;color:#111827;font-size:22px;font-weight:700;">Booking Cancelled</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi ${data.userName}, your booking has been successfully cancelled.</p>

    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#dc2626;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Cancelled Booking</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Booking ID", `#${data.bookingId.slice(-8).toUpperCase()}`)}
        ${detailRow("Venue", data.turfName)}
        ${detailRow("Court", `${data.courtName} · ${data.sport}`)}
        ${detailRow("Date", data.date)}
        ${detailRow("Time", `${data.startTime} – ${data.endTime}`)}
      </table>
    </div>

    <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:14px 16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
      <p style="margin:0;color:#15803d;font-size:14px;font-weight:500;">
        ✅ Refund processed — ₹${data.totalAmount.toLocaleString("en-IN")} will reflect in 5–7 business days.
      </p>
    </div>

    <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
      Want to book another slot? <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" style="color:#16a34a;font-weight:500;">Browse turfs →</a>
    </p>`;

  return baseTemplate(content, `Your booking at ${data.turfName} has been cancelled.`);
}