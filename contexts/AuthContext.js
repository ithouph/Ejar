import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth as authApi, users as usersApi } from '../services';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();

    const { data: { subscription } } = authApi.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function loadSession() {
    try {
      const session = await authApi.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(userId) {
    try {
      const userProfile = await usersApi.getUser(userId);
      setProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  async function sendOtp(phone) {
    try {
      setLoading(true);
      const result = await authApi.sendOtp(phone);
      return result;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(phone, token) {
    try {
      setLoading(true);
      const { user, session } = await authApi.verifyOtp(phone, token);
      setUser(user);
      setSession(session);
      
      if (user) {
        const userProfile = await loadProfile(user.id);
        return { user, session, profile: userProfile, isNewUser: !userProfile };
      }
      
      return { user, session, profile: null, isNewUser: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function completeRegistration(userData) {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const createData = {
        id: user.id,
        phone: user.phone,
        whatsapp_number: userData.whatsapp_number || user.phone,
        first_name: userData.first_name,
        last_name: userData.last_name,
        city_id: userData.city_id,
      };

      // Only include profile_photo_url if provided
      if (userData.profile_photo_url) {
        createData.profile_photo_url = userData.profile_photo_url;
      }

      const newProfile = await usersApi.createUser(createData);
      setProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates) {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const updatedProfile = await usersApi.updateUser(user.id, updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await authApi.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser() {
    try {
      const session = await authApi.getSession();
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        const userProfile = await loadProfile(session.user.id);
        return { user: session.user, profile: userProfile };
      }
      return { user: null, profile: null };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { user: null, profile: null };
    }
  }

  // TEMPORARY: Guest login for testing without Supabase setup
  async function signInAsGuest() {
    try {
      setLoading(true);
      
      const guestUser = {
        id: '00000000-0000-0000-0000-000000000001',
        phone: '+22212345678',
      };
      
      const guestSession = {
        user: guestUser,
        access_token: 'guest-token',
      };

      const guestProfile = {
        id: guestUser.id,
        phone: guestUser.phone,
        whatsapp_number: guestUser.phone,
        first_name: 'Guest',
        last_name: 'User',
        city_id: null,
        cities: { name: 'Nouakchott' },
        role: 'normal',
        wallet_balance_mru: 0,
        free_posts_remaining: 5,
      };
      
      setUser(guestUser);
      setSession(guestSession);
      setProfile(guestProfile);
      
      return { user: guestUser, session: guestSession, profile: guestProfile };
    } catch (error) {
      console.error('Guest sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    isProfileComplete: !!profile,
    sendOtp,
    verifyOtp,
    completeRegistration,
    updateProfile,
    signInAsGuest,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
