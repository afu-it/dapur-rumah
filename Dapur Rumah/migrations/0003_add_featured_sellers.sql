-- Phase 8.1: Add is_featured column to sellers
ALTER TABLE sellers ADD COLUMN is_featured INTEGER DEFAULT 0;
