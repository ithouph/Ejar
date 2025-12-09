import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import ErrorBoundary from './components/ErrorBoundary';
import MainTabNavigator from './components/MainTabNavigator';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import { useTheme } from './hooks/useTheme';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

function AuthGate() {
  const { user, profile, loading, isProfileComplete } = useAuth();
  const { isDark, theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {!user ? (
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
        </Stack.Navigator>
      ) : !isProfileComplete ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
        </Stack.Navigator>
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider>
            <AuthGate />
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
