import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";
import { auth as phoneAuth, users as usersApi } from "../services/database";
import { supabase } from "../config/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Priority: Load from AsyncStorage first (for offline persistence)
    // Then check authService (for online sessions)
    loadSession();
  }, []);

  async function loadSession() {
    try {
      setLoading(true);
      
      // Step 1: Try to restore session from AsyncStorage (persistent across restarts)
      const savedSession = await AsyncStorage.getItem("ejar_user_session");
      if (savedSession) {
        const userData = JSON.parse(savedSession);
        setUser(userData);
        setSession({ user: userData });
        console.log("✅ Session restored from AsyncStorage:", userData.id);
        setLoading(false);
        return; // Exit early - session restored successfully
      }

      // Step 2: Fallback to authService if no cached session
      const session = await authService.getSession();
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        // Cache this session for next time
        await AsyncStorage.setItem("ejar_user_session", JSON.stringify(session.user));
        console.log("✅ Session restored from authService:", session.user.id);
      } else {
        // No session found anywhere
        setSession(null);
        setUser(null);
        console.log("ℹ️ No session found - user needs to login");
      }
    } catch (error) {
      console.error("Error loading session:", error);
      setSession(null);
      setUser(null);
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
      console.log("🔄 Frontend: Starting complete logout process...");
      
      // Step 1: Clear backend session (Supabase)
      console.log("📡 Frontend: Notifying backend to clear session...");
      await authService.signOut();
      console.log("✅ Frontend: Backend session cleared");
      
      // Step 2: Clear local storage
      await AsyncStorage.removeItem("ejar_user_session");
      console.log("✅ Frontend: Local storage session cleared");
      
      // Step 3: Clear app state
      setUser(null);
      setSession(null);
      console.log("✅ Frontend: App state cleared");
      
      console.log("✅ Frontend: User logged out successfully - redirecting to login");
      return true;
    } catch (error) {
      console.error("❌ Frontend: Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signInWithPhoneOTP(user, phoneNumber) {
    try {
      setLoading(true);
      setUser(user);
      setSession({ user });
      
      // Save session to AsyncStorage for persistence
      await AsyncStorage.setItem("ejar_user_session", JSON.stringify(user));
      console.log("✅ Session saved and user logged in:", user.id);
      
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
      
      const guestUserFromDb = await usersApi.getByPhoneNumber(guestPhoneNumber);
      
      if (!guestUserFromDb) {
        console.error("Guest user not found:", guestPhoneNumber);
        throw new Error("Guest user not found in database");
      }

      console.log("✅ Guest user found:", guestUserFromDb);

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

      setUser(userData);
      setSession({ user: userData });
      
      // Save session to AsyncStorage
      await AsyncStorage.setItem("ejar_user_session", JSON.stringify(userData));
      console.log("✅ Guest session saved, should redirect now");
      
      return { user: userData };
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
