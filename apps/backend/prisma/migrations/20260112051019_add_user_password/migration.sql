/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "users" ADD COLUMN "password" TEXT;

-- Set a default hashed password for existing users (password: "password123")
-- This is bcrypt hash of "password123" with salt rounds 10
UPDATE "users" SET "password" = '$2a$10$YourHashedPasswordHere' WHERE "password" IS NULL;

-- Make password required
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;
