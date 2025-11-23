import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Employee {
  id?: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  date_of_joining: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}
