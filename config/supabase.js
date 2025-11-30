import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Load Supabase credentials from Expo extra
const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig?.extra || {};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("❌ Supabase URL or Anon Key missing in app.json -> extra");
}

// Initialize Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

if (!supabase) {
  throw new Error("Supabase client is not initialized. Check app.json extra values.");
}
