import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Replace with your Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);