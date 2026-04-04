import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Hospital = {
  id: string;
  name: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  phone: string;
  is_online: boolean;
  login_id: string;
  created_at: string;
  updated_at: string;
};

export type BedAvailability = {
  id: string;
  hospital_id: string;
  bed_type: string;
  total_beds: number;
  available_beds: number;
  status: 'AVAILABLE' | 'MODERATE' | 'CRITICAL';
  last_updated: string;
  created_at: string;
};

export type HospitalWithBeds = Hospital & {
  bed_availability: BedAvailability[];
};
