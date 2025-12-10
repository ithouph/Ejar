import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_MODE_KEY = '@ejar_dev_mode';
const DEV_SESSION_KEY = '@ejar_dev_session';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

let pendingOtp = null;

export const auth = {
  async sendOtp(phone) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      
      if (error) {
        if (error.message.includes('not enabled') || 
            error.message.includes('Phone auth') ||
            error.message.includes('provider') ||
            error.status === 400) {
          pendingOtp = generateOtp();
          console.log('═══════════════════════════════════════════');
          console.log('DEV MODE: Supabase Phone Auth not configured');
          console.log(`Phone: ${phone}`);
          console.log(`OTP Code: ${pendingOtp}`);
          console.log('═══════════════════════════════════════════');
          await AsyncStorage.setItem(DEV_MODE_KEY, 'true');
          await AsyncStorage.setItem('@pending_phone', phone);
          return { devMode: true };
        }
        throw error;
      }
      
      await AsyncStorage.setItem(DEV_MODE_KEY, 'false');
      return data;
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('network')) {
        pendingOtp = generateOtp();
        console.log('═══════════════════════════════════════════');
        console.log('DEV MODE: Network error - using console OTP');
        console.log(`Phone: ${phone}`);
        console.log(`OTP Code: ${pendingOtp}`);
        console.log('═══════════════════════════════════════════');
        await AsyncStorage.setItem(DEV_MODE_KEY, 'true');
        await AsyncStorage.setItem('@pending_phone', phone);
        return { devMode: true };
      }
      throw err;
    }
  },

  async verifyOtp(phone, token) {
    const devMode = await AsyncStorage.getItem(DEV_MODE_KEY);
    
    if (devMode === 'true') {
      if (token === pendingOtp) {
        const devUser = {
          id: 'dev-user-' + phone.replace(/\D/g, ''),
          phone: phone,
          created_at: new Date().toISOString(),
        };
        
        const devSession = {
          user: devUser,
          access_token: 'dev-token-' + Date.now(),
          expires_at: Date.now() + 86400000,
        };
        
        await AsyncStorage.setItem(DEV_SESSION_KEY, JSON.stringify(devSession));
        pendingOtp = null;
        
        console.log('═══════════════════════════════════════════');
        console.log('DEV MODE: OTP verified successfully!');
        console.log(`User ID: ${devUser.id}`);
        console.log('═══════════════════════════════════════════');
        
        return { user: devUser, session: devSession };
      } else {
        throw new Error('Invalid OTP code');
      }
    }
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms',
    });
    if (error) throw error;
    return { user: data.user, session: data.session };
  },

  async signOut() {
    const devMode = await AsyncStorage.getItem(DEV_MODE_KEY);
    
    if (devMode === 'true') {
      await AsyncStorage.removeItem(DEV_SESSION_KEY);
      await AsyncStorage.removeItem(DEV_MODE_KEY);
      await AsyncStorage.removeItem('@pending_phone');
      console.log('DEV MODE: Signed out');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const devMode = await AsyncStorage.getItem(DEV_MODE_KEY);
    
    if (devMode === 'true') {
      const sessionStr = await AsyncStorage.getItem(DEV_SESSION_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.expires_at > Date.now()) {
          return session.user;
        }
      }
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  async getSession() {
    const devMode = await AsyncStorage.getItem(DEV_MODE_KEY);
    
    if (devMode === 'true') {
      const sessionStr = await AsyncStorage.getItem(DEV_SESSION_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.expires_at > Date.now()) {
          return session;
        }
      }
      return null;
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
  
  async isDevMode() {
    const devMode = await AsyncStorage.getItem(DEV_MODE_KEY);
    return devMode === 'true';
  },
};
