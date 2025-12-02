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
      
      // UUID validation function
      const isValidUUID = (id) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      };
      
      // CRITICAL: Clear all old sessions with invalid ID formats (migration from old string-based IDs)
      const savedSession = await AsyncStorage.getItem("ejar_user_session");
      if (savedSession) {
        try {
          const userData = JSON.parse(savedSession);
          if (!isValidUUID(userData.id)) {
            console.log("🧹 CLEARING INVALID SESSION FORMAT. Old ID:", userData.id);
            await AsyncStorage.removeItem("ejar_user_session");
            // Force complete logout
            setUser(null);
            setSession(null);
            setLoading(false);
            return;
          }
          
          // Valid UUID - restore it
          setUser(userData);
          setSession({ user: userData });
          console.log("✅ Session restored from AsyncStorage with UUID:", userData.id);
          setLoading(false);
          return;
        } catch (parseError) {
          console.error("Error parsing saved session:", parseError);
          await AsyncStorage.removeItem("ejar_user_session");
        }
      }

      // No valid cached session - try authService
      const session = await authService.getSession();
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        await AsyncStorage.setItem("ejar_user_session", JSON.stringify(session.user));
        console.log("✅ Session from authService:", session.user.id);
      } else {
        setSession(null);
        setUser(null);
        console.log("ℹ️ No session - user needs to login");
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
      
      console.log("\n========================================");
      console.log("🔄 LOGOUT PROCESS STARTED");
      console.log("========================================\n");
      
      // Step 1: Log current session before deletion
      const currentSession = await AsyncStorage.getItem("ejar_user_session");
      if (currentSession) {
        const sessionData = JSON.parse(currentSession);
        console.log("📋 Current Session (BEFORE DELETION):");
        console.log("   User ID:", sessionData.id);
        console.log("   Phone:", sessionData.phone_number);
        console.log("   Member Status:", sessionData.is_member);
        console.log("   Post Limit:", sessionData.post_limit);
        console.log("   Created At:", sessionData.created_at);
      }
      
      console.log("\n🔄 Clearing backend session...");
      await authService.signOut();
      console.log("✅ Backend session cleared\n");
      
      // Step 2: Clear local storage
      console.log("🗑️  Deleting saved session from AsyncStorage...");
      console.log("📍 Running: AsyncStorage.removeItem('ejar_user_session')");
      await AsyncStorage.removeItem("ejar_user_session");
      console.log("✅ AsyncStorage.removeItem('ejar_user_session') - COMPLETED\n");
      
      // Step 3: Clear app state
      console.log("🧹 Clearing app state...");
      setUser(null);
      setSession(null);
      console.log("✅ App state cleared\n");
      
      console.log("========================================");
      console.log("✅ LOGOUT COMPLETE!");
      console.log("========================================");
      console.log("📌 Status: Session deleted successfully");
      console.log("📌 Action: You will be redirected to login page");
      console.log("📌 Next Step: Log in again to use the app\n");
      
      return true;
    } catch (error) {
      console.error("❌ Logout error:", error);
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
