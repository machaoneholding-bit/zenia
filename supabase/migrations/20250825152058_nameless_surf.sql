/*
  # Add FPS Payment Tracking

  1. New Tables
    - `fps_payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `fps_number` (text)
      - `fps_key` (text)
      - `license_plate` (text)
      - `base_amount` (numeric)
      - `service_fees` (numeric)
      - `total_amount` (numeric)
      - `payment_method` (text)
      - `stripe_session_id` (text)
      - `stripe_payment_intent_id` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `paid_at` (timestamp)

  2. Security
    - Enable RLS on `fps_payments` table
    - Add policies for users to manage their own FPS payments
*/

CREATE TABLE IF NOT EXISTS fps_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fps_number text NOT NULL,
  fps_key text NOT NULL,
  license_plate text NOT NULL,
  base_amount numeric(10,2) NOT NULL,
  service_fees numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('immediate', 'split3', 'split4', 'deferred')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'canceled')),
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- Enable RLS
ALTER TABLE fps_payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert own FPS payments"
  ON fps_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own FPS payments"
  ON fps_payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own FPS payments"
  ON fps_payments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fps_payments_user_id ON fps_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_fps_payments_status ON fps_payments(status);
CREATE INDEX IF NOT EXISTS idx_fps_payments_stripe_session ON fps_payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_fps_payments_created_at ON fps_payments(created_at DESC);