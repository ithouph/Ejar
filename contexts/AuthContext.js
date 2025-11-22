import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth as authApi } from '../services/database';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();

    const { data: { subscription } } = authApi.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
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
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      setLoading(true);
      const { user, session } = await authApi.signInWithGoogle();
      setUser(user);
      setSession(session);
      return { user, session };
    } catch (error) {
      console.error('Sign in error:', error);
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
        setUser({ ...session.user, _refreshTrigger: Date.now() });
      }
      return session?.user || null;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  }

  // TEMPORARY: Guest login for testing without Supabase setup
  // This creates a fake user session so you can test the app
  // REMOVE THIS when you set up real authentication
  async function signInAsGuest() {
    try {
      setLoading(true);
      
      const guestUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'guest@travelstay.com',
        user_metadata: {
          full_name: 'Guest User',
          avatar_url: null,
        },
      };
      
      const guestSession = {
        user: guestUser,
        access_token: 'guest-token',
      };
      
      setUser(guestUser);
      setSession(guestSession);
      
      return { user: guestUser, session: guestSession };
    } catch (error) {
      console.error('Guest sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
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
