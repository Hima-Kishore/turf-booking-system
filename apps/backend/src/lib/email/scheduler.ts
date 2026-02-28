import cron from "node-cron";
import { prisma } from "../prisma";
import { sendBookingReminder, buildBookingEmailData } from "./index";
import { startOfDay, endOfDay, addDays } from "date-fns";

export function startReminderScheduler() {
  cron.schedule("0 9 * * *", async () => {
    console.log("📅 Running booking reminder job...");

    const tomorrow = addDays(new Date(), 1);
    const from = startOfDay(tomorrow);
    const to = endOfDay(tomorrow);

    try {
      const bookings = await prisma.booking.findMany({
        where: {
          status: "CONFIRMED",
          slot: {
            startTime: { gte: from, lte: to },
          },
          reminderSent: false, 
        },
        include: {
          user: true,
          slot: {
            include: {
              court: {
                include: { turf: true },
              },
            },
          },
        },
      });

      console.log(`   Found ${bookings.length} upcoming bookings`);

      for (const booking of bookings) {
        try {
          await sendBookingReminder(buildBookingEmailData(booking));
          await prisma.booking.update({
            where: { id: booking.id },
            data: { reminderSent: true },
          });
        } catch (err) {
          console.error(`   Failed reminder for booking ${booking.id}:`, err);
        }
      }
    } catch (err) {
      console.error("Reminder scheduler error:", err);
    }
  });

  console.log("⏰ Booking reminder scheduler started (runs daily at 9 AM)");
}