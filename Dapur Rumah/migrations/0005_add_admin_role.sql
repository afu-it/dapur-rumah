-- Phase 8.6: Add is_admin flag to user table (Better Auth uses its own user table)
ALTER TABLE "user" ADD COLUMN is_admin INTEGER DEFAULT 0;
