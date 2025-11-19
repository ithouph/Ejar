import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './components/ErrorBoundary';
import MainTabNavigator from './navigation/MainTabNavigator';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

/**
 * MAIN APP NAVIGATION
 * 
 * This controls the initial flow of the app:
 * Welcome Screen → Login Screen → Main App (Tabs)
 * 
 * EASY CUSTOMIZATION GUIDE:
 * 
 * 1. TO CHANGE STARTING SCREEN:
 *    - Change initialRouteName="Welcome" to:
 *      - "Login" to start at login
 *      - "Main" to skip welcome/login (for testing)
 * 
 * 2. TO ADD A NEW SCREEN BEFORE TABS:
 *    - Add another <Stack.Screen> here
 *    - Example: <Stack.Screen name="Tutorial" component={Tutorial} />
 * 
 * 3. TO SKIP WELCOME SCREEN:
 *    - Change initialRouteName to "Login"
 *    - Or remove the Welcome screen entirely
 * 
 * 4. TO REMOVE LOGIN:
 *    - Change initialRouteName to "Main"
 *    - Comment out or delete Login screen
 */
function Navigation() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer>
      {/* Status bar color (clock, battery icons) */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Navigator
        // STARTING SCREEN - Change this to start on a different screen
        initialRouteName="Welcome"
        
        screenOptions={{
          // Hide headers on all screens (we use custom headers)
          headerShown: false,
        }}
      >
        {/* SCREEN 1: Welcome/Splash */}
        <Stack.Screen name="Welcome" component={Welcome} />
        
        {/* SCREEN 2: Login/Sign Up */}
        <Stack.Screen name="Login" component={Login} />
        
        {/* SCREEN 3: Main App with Bottom Tabs */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * ROOT APP COMPONENT
 * 
 * This wraps everything and sets up:
 * - Error handling (crashes show friendly message)
 * - Gestures (for swipes, taps)
 * - Safe areas (notch/home indicator handling)
 * - Authentication state
 * 
 * DON'T CHANGE THIS unless you know what you're doing!
 */
export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
