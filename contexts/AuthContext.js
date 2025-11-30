import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";
import { auth as phoneAuth, users as usersApi } from "../services/database";
import { supabase } from "../config/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function loadSession() {
    try {
      const session = await authService.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      setLoading(true);
      const { user, session } = await authService.signInWithGoogle();
      setUser(user);
      setSession(session);
      return { user, session };
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signInWithPhoneOTP(user, phoneNumber) {
    try {
      setLoading(true);
      setUser(user);
      return { user };
    } catch (error) {
      console.error("Phone OTP sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function guestSignIn() {
    try {
      setLoading(true);
      const guestPhoneNumber = "22212345678";
      
      console.log("🔄 Starting guest sign in for:", guestPhoneNumber);
      
      // Fetch guest user from database by phone number
      const guestUserFromDb = await usersApi.getByPhoneNumber(guestPhoneNumber);
      
      if (!guestUserFromDb) {
        console.error("Guest user not found:", guestPhoneNumber);
        throw new Error("Guest user not found in database");
      }

      console.log("✅ Guest user found:", guestUserFromDb);

      // Create a session object with the user data
      const userData = {
        id: guestUserFromDb.id,
        phone_number: guestUserFromDb.phone_number,
        whatsapp_phone: guestUserFromDb.whatsapp_phone,
        post_limit: guestUserFromDb.post_limit,
        posts_count: guestUserFromDb.posts_count,
        is_member: guestUserFromDb.is_member,
        hit_limit: guestUserFromDb.hit_limit,
        created_at: guestUserFromDb.created_at,
        updated_at: guestUserFromDb.updated_at,
      };

      // Set user state first
      setUser(userData);
      console.log("✅ User state set, should redirect now");
      
      const sessionData = { user: userData };
      setSession(sessionData);
      
      return sessionData;
    } catch (error) {
      console.error("❌ Guest sign in error:", error?.message || error);
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
    signInWithPhoneOTP,
    guestSignIn,
    signOut,
    refreshUser: loadSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
