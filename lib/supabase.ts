import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://wrmcurwfgptpnbozsdcz.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybWN1cndmZ3B0cG5ib3pzZGN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTI2ODA3NCwiZXhwIjoyMDU2ODQ0MDc0fQ.w52vgAfE8cZ9ORGuaDOXFYeof2OQDFTmJrA5DBczD7w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true } });
