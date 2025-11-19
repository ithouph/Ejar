import { supabase } from '../config/supabase';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('✅ Supabase connected successfully (table not found is expected)');
      return { connected: true, message: 'Connection successful' };
    }
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return { connected: false, error: error.message };
    }
    
    console.log('✅ Supabase connected successfully');
    return { connected: true, data };
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    return { connected: false, error: err.message };
  }
}
