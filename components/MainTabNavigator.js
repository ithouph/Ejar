import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import DiscoverNavigator from '../router/Discover';
import PostsNavigator from '../router/Posts';
import SavedNavigator from '../router/Saved';
import SettingsNavigator from '../router/Settings';
import { TabBarIcon } from '../components/Navbar';
import { useTheme } from '../hooks/useTheme';
import { Spacing } from '../theme/global';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home', component: DiscoverNavigator, icon: 'home' },
  { name: 'Posts', component: PostsNavigator, icon: 'edit-3' },
  { name: 'Saved', component: SavedNavigator, icon: 'heart' },
  { name: 'Settings', component: SettingsNavigator, icon: 'user' },
];

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      {TAB_CONFIG.map(({ name, component, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={icon} color={color} focused={focused} />
            ),
          }}
        />
      ))}
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
