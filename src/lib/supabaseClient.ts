import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gortqzcuntzboghdjsdf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvcnRxemN1bnR6Ym9naGRqc2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTA0ODQsImV4cCI6MjEwMjYyNjQ4NH0.4t-LrtvHtmoY8NVvUDm_C5L0540r7sOzBjaEQAABl2g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
