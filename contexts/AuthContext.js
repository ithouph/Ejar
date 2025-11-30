import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";
import { auth as phoneAuth } from "../services/database";
import { supabase } from "../config/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // TEMPORARY: Guest login for testing without Supabase setup
  // This creates a fake user session so you can test the app
  // REMOVE THIS when you set up real authentication
  async function signInAsGuest() {
    try {
      setLoading(true);

      // Define guest user
      const guestUser = {
        id: "1c3df422-d55c-4ceb-be95-a63b87f0f1c5",
        email: "custome@ejar.com",
        full_name: "Guest User",
        photo_url: null,
      };
      // Try inserting into Supabase users table (ignore if exists)
      const { data, error } = await supabase.auth.signUp(guestUser);

      if (error) {
        console.error("Error adding guest user to DB:", error);
      }

      const guestSession = {
        user: data || guestUser, // use DB record if exists
        access_token: "guest-token",
      };

      setUser(guestSession.user);
      setSession(guestSession);

      return { user: guestSession.user, session: guestSession };
    } catch (error) {
      console.error("Guest sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signInWithPhoneOTP(user, phoneNumber) {
    try {
      setLoading(true);
      // Store user data in local storage
      const userData = {
        id: user.id,
        phone: phoneNumber,
        phone_number: phoneNumber,
        created_at: user.created_at,
      };
      await AsyncStorage.setItem("@ejar_user", JSON.stringify(userData));
      setUser(userData);
      return { user: userData };
    } catch (error) {
      console.error("Phone OTP sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function loadStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem("@ejar_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
    }
  }

  useEffect(() => {
    loadStoredUser();
  }, []);

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithPhoneOTP,
    signInAsGuest,
    signOut,
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
