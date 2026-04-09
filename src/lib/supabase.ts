import { createClient } from '@supabase/supabase-js'; // Thêm dấu / vào đây

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);