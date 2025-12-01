import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import ErrorBoundary from "./components/ErrorBoundary";
import MainTabNavigator from "./components/TabNavigator";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import { useTheme } from "./hooks/useTheme";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const Stack = createNativeStackNavigator();

/**
 * ═══════════════════════════════════════════════════════════════════
 * AUTH GATE - CONTROLS NAVIGATION BASED ON LOGIN STATUS
 * ═══════════════════════════════════════════════════════════════════
 *
 * This checks if user is logged in and shows the right screens:
 * - NOT logged in: Shows Welcome → Login screens
 * - LOGGED IN: Shows Main app with tabs
 * - LOADING: Shows loading spinner
 *
 * WHY THIS FIXES THE ISSUE:
 * - Before: Login button always went to homepage (even without login)
 * - Now: Only goes to homepage AFTER successful login
 *
 * CUSTOMIZATION:
 * - Add more auth screens (Register, ForgotPassword) to AuthStack
 * - Change loading spinner design
 * - Add splash screen while loading
 */
function AuthGate() {
  const { user, loading } = useAuth();
  const { isDark, theme } = useTheme();

  // STEP 1: Show loading spinner while checking if user is logged in
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* STEP 2: Show different screens based on login status */}
      {!user ? (
        // ═══════════════════════════════════════════════════════════
        // NOT LOGGED IN - Show welcome/login screens
        // ═══════════════════════════════════════════════════════════
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false, // Prevent back swipe gesture
            animationEnabled: true,
          }}
        >
          {/* Welcome Screen - Entry point, no back navigation */}
          <Stack.Screen 
            name="Welcome" 
            component={Welcome}
            options={{
              gestureEnabled: false,
            }}
          />

          {/* Login Screen - No back to Welcome (user must tap back button explicitly on Welcome) */}
          <Stack.Screen 
            name="Login" 
            component={Login}
            options={{
              gestureEnabled: false,
            }}
          />

          {/* 
              TO ADD MORE AUTH SCREENS:
              - Create Register.js in /pages
              - Add: <Stack.Screen name="Register" component={Register} />
              - Same for ForgotPassword, etc.
            */}
        </Stack.Navigator>
      ) : (
        // ═══════════════════════════════════════════════════════════
        // LOGGED IN - Show main app
        // ═══════════════════════════════════════════════════════════
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * ROOT APP COMPONENT
 * ═══════════════════════════════════════════════════════════════════
 *
 * This wraps everything and sets up:
 * - Error handling (crashes show friendly message)
 * - Gestures (for swipes, taps)
 * - Safe areas (notch/home indicator handling)
 * - Authentication state (AuthProvider)
 *
 * DON'T CHANGE THIS unless you know what you're doing!
 */
export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, }}>
        <SafeAreaProvider>
          {/* AuthProvider manages login state throughout app */}
          <AuthProvider>
            {/* AuthGate shows Welcome/Login OR Main App based on login */}
            <AuthGate />
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
