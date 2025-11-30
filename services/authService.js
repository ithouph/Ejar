import { supabase } from "../config/supabase";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, AuthSession } from "expo-auth-session";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export const authService = {
  async signInWithGoogle() {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      // Platform-specific redirect URL
      const redirectUrl =
        Platform.OS === "web"
          ? window.location.origin // Web redirect
          : makeRedirectUri({
              scheme: "com.ejar.app",
              path: "auth/callback",
              useProxy: true,
            });

      console.log("REDIRECT URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          redirectTo: "http://localhost:8081/",
          skipBrowserRedirect: Platform.OS !== "web", // mobile uses WebBrowser
        },
      });

      if (error) throw error;

      // Mobile flow with WebBrowser
      if (Platform.OS !== "web" && data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
        );

        if (result.type === "success") {
          const url = new URL(result.url);
          const accessToken = url.searchParams.get("access_token");
          const refreshToken = url.searchParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (sessionError) throw sessionError;

            console.log("User signed in:", sessionData.user);
            return { user: sessionData.user, session: sessionData.session };
          }
        }
      }

      // On web, Supabase handles redirect automatically
      return null;
    } catch (err) {
      console.error("Google sign-in error:", err);
      throw err;
    }
  },

  async signOut() {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      console.log("🔄 Backend: Starting Supabase session termination...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Backend: Supabase session termination failed:", error);
        throw error;
      }
      
      console.log("✅ Backend: Supabase session cleared successfully");
      
      // Clear any cached session data in Supabase client
      const { data } = await supabase.auth.getSession();
      if (data?.session === null) {
        console.log("✅ Backend: Verified - no active session in Supabase");
      }
      
      return true;
    } catch (err) {
      console.error("❌ Sign out error:", err);
      throw err;
    }
  },

  async getCurrentUser() {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (err) {
      console.error("Get user error:", err);
      return null;
    }
  },

  async getSession() {
    if (!supabase) throw new Error("Supabase client not initialized");

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (err) {
      console.error("Get session error:", err);
      return null;
    }
  },

  onAuthStateChange(callback) {
    if (!supabase) throw new Error("Supabase client not initialized");
    return supabase.auth.onAuthStateChange((event, session) =>
      callback(event, session),
    );
  },
};
