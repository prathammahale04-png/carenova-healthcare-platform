import { createClient } from '@supabase/supabase-js';

/**
 * Sanitizes the Supabase project URL:
 * - Trims whitespace and quotes
 * - Strips trailing slashes
 * - Strips /rest/v1 or /rest/v1/ if user pasted the PostgREST REST endpoint instead of the project root
 *   (which causes PostgREST error PGRST125: "Invalid path specified in request URL")
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

const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = sanitizeSupabaseKey(rawSupabaseAnonKey);

/**
 * Returns true if real Supabase credentials have been configured
 * in the environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).
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

/**
 * Standard Supabase client using public/publishable anon key only.
 * Fallbacks to safe placeholder values when environment variables are not yet populated.
 */
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    },
    db: {
      schema: 'public'
    }
  }
);
