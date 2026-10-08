import { createClient } from '@supabase/supabase-js';

/**
 * Sanitizes the Supabase project URL:
 * - Trims whitespace and quotes
 * - Strips trailing slashes
 * - Strips /rest/v1 or /rest/v1/ if pasted instead of the project root URL
 */
export const sanitizeSupabaseUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';
  let url = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  url = url.replace(/\/+$/, '');
  url = url.replace(/\/rest\/v1\/?$/i, '');
  url = url.replace(/\/+$/, '');
  return url;
};

export const sanitizeSupabaseKey = (rawKey?: string): string => {
  if (!rawKey) return '';
  return rawKey.trim().replace(/^['"]|['"]$/g, '');
};

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl);
export const supabaseAnonKey = sanitizeSupabaseKey(rawSupabaseAnonKey);

/**
 * Validates the existence and format of required Supabase environment variables.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key' &&
    !supabaseUrl.includes('placeholder')
  );
};

export const getSupabaseConfigError = (): string | null => {
  if (!rawSupabaseUrl || !rawSupabaseAnonKey) {
    return 'Missing Supabase credentials: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined.';
  }
  if (!supabaseUrl.startsWith('https://')) {
    return 'Invalid Supabase URL: VITE_SUPABASE_URL must be a valid HTTPS URL (e.g. https://xyz.supabase.co).';
  }
  return null;
};

// Immediate development validation notice
if (!isSupabaseConfigured()) {
  console.warn(
    '[CareNova Supabase Configuration Notice]',
    getSupabaseConfigError() || 'Supabase environment variables are missing or set to placeholder values.'
  );
}

/**
 * Standard reusable Supabase client with persistSession enabled for Auth.
 */
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
);
