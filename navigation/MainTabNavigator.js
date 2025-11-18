import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import DiscoverNavigator from '../router/Discover';
import BalanceNavigator from '../router/Balance';
import SavedNavigator from '../router/Saved';
import SettingsNavigator from '../router/Settings';
import { TabBarIcon } from '../components/Navbar';
import { useTheme } from '../hooks/useTheme';
import { Spacing } from '../theme/global';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DiscoverNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Balance"
        component={BalanceNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="tag" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="heart" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Spacing.tabBarHeight,
    borderTopWidth: 0,
    elevation: 0,
  },
});
