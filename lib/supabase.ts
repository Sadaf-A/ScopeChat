import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://wrmcurwfgptpnbozsdcz.supabase.co/";
const supabaseAnonKey = process.env.SUPABASE_SECRET;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true } });
