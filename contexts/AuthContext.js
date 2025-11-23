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

  async function signUpWithGoogle() {
    try {
      setLoading(true);
      const { user, session } = await authApi.signUpWithGoogle();
      setUser(user);
      setSession(session);
      return { user, session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
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

  // Guest login (local session only)
  // NOTE: Guest mode has limitations - wallet features require Google OAuth
  async function signInAsGuest() {
    try {
      setLoading(true);
      const { user, session } = await authApi.signInAsGuest();
      setUser(user);
      setSession(session);
      return { user, session };
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
    signUpWithGoogle,
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
