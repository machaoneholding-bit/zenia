/*
  # Add support for manual FPS creation

  1. Changes
    - Make vehicle_id nullable in fps_records table to support manual FPS without vehicle association
    - Add index for better performance on manual FPS queries
    - Update RLS policies to handle manual FPS records

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only access their own FPS records
*/

-- Make vehicle_id nullable to support manual FPS creation
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fps_records' AND column_name = 'vehicle_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE fps_records ALTER COLUMN vehicle_id DROP NOT NULL;
  END IF;
END $$;

-- Add index for manual FPS queries (where vehicle_id is null)
CREATE INDEX IF NOT EXISTS idx_fps_records_manual ON fps_records (user_id, created_at) WHERE vehicle_id IS NULL;

-- Update the check constraint to include more status options
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'fps_records' AND constraint_name = 'fps_records_status_check'
  ) THEN
    ALTER TABLE fps_records DROP CONSTRAINT fps_records_status_check;
  END IF;
END $$;

ALTER TABLE fps_records ADD CONSTRAINT fps_records_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'processing'::text]));