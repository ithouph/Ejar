import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

// Load Supabase credentials from Expo extra

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("❌ Supabase URL or Anon Key missing in app.json -> extra");
}

// Initialize Supabase client
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

if (!supabase) {
  throw new Error(
    "Supabase client is not initialized. Check app.json extra values.",
  );
}
