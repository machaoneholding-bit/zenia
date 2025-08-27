/*
  # Add invoice tracking to orders

  1. Changes
    - Add `invoice_id` column to `stripe_orders` table to track Stripe invoices
    - Add `invoice_url` column to store the invoice PDF URL
    - Add `invoice_sent_at` column to track when the invoice was sent

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

DO $$
BEGIN
  -- Add invoice_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_orders' AND column_name = 'invoice_id'
  ) THEN
    ALTER TABLE stripe_orders ADD COLUMN invoice_id text;
  END IF;

  -- Add invoice_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_orders' AND column_name = 'invoice_url'
  ) THEN
    ALTER TABLE stripe_orders ADD COLUMN invoice_url text;
  END IF;

  -- Add invoice_sent_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_orders' AND column_name = 'invoice_sent_at'
  ) THEN
    ALTER TABLE stripe_orders ADD COLUMN invoice_sent_at timestamptz;
  END IF;
END $$;