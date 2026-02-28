-- Add reminderSent flag to Booking table
ALTER TABLE "Booking" ADD COLUMN "reminderSent" BOOLEAN NOT NULL DEFAULT false;