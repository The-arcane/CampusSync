import { createBrowserClient } from "@supabase/ssr";

function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url || url.includes('YOUR_SUPABASE_URL')) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const isSupabaseConfigured =
  isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY');

export const supabase =
  isSupabaseConfigured
    ? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
    : null;
