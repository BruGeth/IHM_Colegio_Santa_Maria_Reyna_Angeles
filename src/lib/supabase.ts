import { createClient } from '@supabase/supabase-js';

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const rawKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
