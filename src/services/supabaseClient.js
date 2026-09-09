import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cgbqodjgkswcpoawzejl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_an9xD2xs_BZh25uWFj-tbA_FheS31Hy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
