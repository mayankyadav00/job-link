// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// 1. Read the secret variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. Error check (Optional but helpful for debugging)
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase Environment Variables!");
}

// 3. Connect
export const supabase = createClient(supabaseUrl, supabaseKey);
