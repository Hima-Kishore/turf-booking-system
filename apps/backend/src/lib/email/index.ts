import { sendMail } from "./transporter";
import { bookingConfirmedTemplate } from "./templates/bookingConfirmed";
import { bookingCancelledTemplate } from "./templates/bookingCancelled";
import { bookingReminderTemplate } from "./templates/bookingReminder";
import { welcomeTemplate } from "./templates/welcome";
import { reviewReceivedTemplate } from "./templates/reviewReceived";
import type { BookingEmailData, ReviewEmailData, WelcomeEmailData } from "@repo/shared-types";

// ─── Public email functions ────────────────────────────────────────────────

export async function sendBookingConfirmation(data: BookingEmailData) {
  await sendMail({
    to: data.userEmail,
    subject: `✅ Booking Confirmed – ${data.turfName} on ${data.date}`,
    html: bookingConfirmedTemplate(data),
    text: `Booking confirmed for ${data.turfName} on ${data.date} at ${data.startTime}.`,
  });
}

export async function sendBookingCancellation(data: BookingEmailData) {
  await sendMail({
    to: data.userEmail,
    subject: `Booking Cancelled – ${data.turfName} on ${data.date}`,
    html: bookingCancelledTemplate(data),
  });
}

export async function sendBookingReminder(data: BookingEmailData) {
  await sendMail({
    to: data.userEmail,
    subject: `⏰ Reminder: ${data.sport} tomorrow at ${data.startTime} – ${data.turfName}`,
    html: bookingReminderTemplate(data),
  });
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  await sendMail({
    to: data.userEmail,
    subject: `Welcome to TurfBook, ${data.userName}! 🎉`,
    html: welcomeTemplate(data),
  });
}

export async function sendReviewNotification(data: ReviewEmailData) {
  await sendMail({
    to: data.ownerEmail,
    subject: `New ${data.rating}★ Review for ${data.turfName}`,
    html: reviewReceivedTemplate(data),
  });
}

// Re-export helper for building BookingEmailData from Prisma booking
export { buildBookingEmailData } from "./helpers";