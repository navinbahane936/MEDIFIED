/*
  # MediFind Hospital Bed Tracker Schema

  ## Overview
  This migration creates the core database structure for the MediFind hospital bed availability tracker.

  ## New Tables

  ### `hospitals`
  Stores information about hospitals in the Mumbai region
  - `id` (uuid, primary key) - Unique hospital identifier
  - `name` (text) - Hospital name
  - `location` (text) - Area/location name
  - `address` (text) - Full address
  - `latitude` (decimal) - GPS latitude coordinate
  - `longitude` (decimal) - GPS longitude coordinate
  - `distance_km` (decimal) - Distance from reference point in km
  - `phone` (text) - Contact phone number
  - `is_online` (boolean) - Whether hospital is currently reporting
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `bed_availability`
  Tracks real-time bed availability for each hospital
  - `id` (uuid, primary key) - Unique record identifier
  - `hospital_id` (uuid, foreign key) - References hospitals table
  - `bed_type` (text) - Type of bed (ICU, Oxygen, Ventilator, Cardiac, Oncology, General)
  - `total_beds` (integer) - Total number of beds of this type
  - `available_beds` (integer) - Currently available beds
  - `status` (text) - Overall status (AVAILABLE, MODERATE, CRITICAL)
  - `last_updated` (timestamptz) - When this data was last updated
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access (for public hospital information)
  - Restrict write access to authenticated users only

  ## Notes
  - Status is calculated based on availability percentage:
    - AVAILABLE: >40% beds available (green)
    - MODERATE: 20-40% beds available (yellow)
    - CRITICAL: <20% beds available (red)
*/

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  latitude decimal(10, 7) NOT NULL,
  longitude decimal(10, 7) NOT NULL,
  distance_km decimal(5, 2) DEFAULT 0,
  phone text NOT NULL,
  is_online boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bed_availability table
CREATE TABLE IF NOT EXISTS bed_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  bed_type text NOT NULL,
  total_beds integer NOT NULL DEFAULT 0,
  available_beds integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'AVAILABLE',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_bed_count CHECK (available_beds >= 0 AND available_beds <= total_beds),
  CONSTRAINT valid_status CHECK (status IN ('AVAILABLE', 'MODERATE', 'CRITICAL'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bed_availability_hospital_id ON bed_availability(hospital_id);
CREATE INDEX IF NOT EXISTS idx_bed_availability_bed_type ON bed_availability(bed_type);
CREATE INDEX IF NOT EXISTS idx_hospitals_is_online ON hospitals(is_online);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_availability ENABLE ROW LEVEL SECURITY;

-- Policies for hospitals table
CREATE POLICY "Allow public read access to hospitals"
  ON hospitals
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert hospitals"
  ON hospitals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hospitals"
  ON hospitals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for bed_availability table
CREATE POLICY "Allow public read access to bed availability"
  ON bed_availability
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert bed availability"
  ON bed_availability
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bed availability"
  ON bed_availability
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update hospitals updated_at
CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON hospitals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();