import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import DiscoverNavigator from '../router/Discover';
import PostsNavigator from '../router/Posts';
import BalanceNavigator from '../router/Balance';
import SavedNavigator from '../router/Saved';
import SettingsNavigator from '../router/Settings';
import { TabBarIcon } from '../components/Navbar';
import { useTheme } from '../hooks/useTheme';
import { Spacing } from '../theme/global';

const Tab = createBottomTabNavigator();

/**
 * MAIN TAB NAVIGATOR
 * 
 * This is the bottom navigation bar with 5 tabs.
 * 
 * EASY CUSTOMIZATION GUIDE:
 * 
 * 1. TO CHANGE TAB ORDER:
 *    - Just move the <Tab.Screen> blocks up or down
 * 
 * 2. TO CHANGE TAB ICONS:
 *    - Change the "name" prop in TabBarIcon
 *    - Find icons at: icons.expo.fyi (Feather icons)
 *    - Example: name="home" → name="compass" 
 * 
 * 3. TO SHOW/HIDE TAB LABELS:
 *    - Change tabBarShowLabel to true (shows labels)
 *    - Change tabBarShowLabel to false (icons only)
 * 
 * 4. TO CHANGE TAB COLORS:
 *    - tabBarActiveTintColor: Color when tab is selected
 *    - tabBarInactiveTintColor: Color when tab is NOT selected
 *    - Change values in theme/colors.js
 * 
 * 5. TO CHANGE TAB BAR HEIGHT:
 *    - Edit Spacing.tabBarHeight in theme/global.js
 * 
 * 6. TO REMOVE BLUR EFFECT:
 *    - Delete the tabBarBackground section
 *    - Add: backgroundColor: theme.background
 * 
 * 7. TO ADD/REMOVE A TAB:
 *    - Copy any <Tab.Screen> block
 *    - Change name, component, and icon
 *    - Create a new navigator in router/ folder
 */
export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        // Hide the header at the top of each screen
        headerShown: false,
        
        // Tab bar styling (see styles.tabBar below)
        tabBarStyle: styles.tabBar,
        
        // Active tab color (when selected) - change in theme/colors.js
        tabBarActiveTintColor: theme.primary,
        
        // Inactive tab color (when NOT selected) - change in theme/colors.js
        tabBarInactiveTintColor: theme.tabIconDefault,
        
        // Blur effect background (iOS liquid glass style)
        // TO REMOVE BLUR: Delete this and add backgroundColor: theme.background
        tabBarBackground: () => (
          <BlurView
            intensity={80} // 0-100, higher = more blur
            tint={isDark ? 'dark' : 'light'} // Auto switches with dark mode
            style={StyleSheet.absoluteFill}
          />
        ),
        
        // Hide text labels under icons
        // Change to true to show labels
        tabBarShowLabel: false,
      }}
    >
      {/* 
        TAB 1: HOME (Discover Properties)
        Icon: home
        To change icon: Replace "home" with any icon from icons.expo.fyi
      */}
      <Tab.Screen
        name="Home"
        component={DiscoverNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />

      {/* 
        TAB 2: POSTS (Social Feed)
        Icon: edit-3
      */}
      <Tab.Screen
        name="Posts"
        component={PostsNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="edit-3" color={color} focused={focused} />
          ),
        }}
      />

      {/* 
        TAB 3: BALANCE (Wallet)
        Icon: tag
      */}
      <Tab.Screen
        name="Balance"
        component={BalanceNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="tag" color={color} focused={focused} />
          ),
        }}
      />

      {/* 
        TAB 4: SAVED (Favorites)
        Icon: heart
      */}
      <Tab.Screen
        name="Saved"
        component={SavedNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="heart" color={color} focused={focused} />
          ),
        }}
      />

      {/* 
        TAB 5: ACCOUNT (Profile & Settings)
        Icon: user
      */}
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

/**
 * TAB BAR STYLES
 * 
 * CUSTOMIZATION:
 * - position: 'absolute' makes it float above content
 *   Change to 'relative' to sit at bottom
 * - height: Change in theme/global.js (Spacing.tabBarHeight)
 * - borderTopWidth: 0 removes top border
 *   Change to 1 to add border
 */
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', // Floats above content
    height: Spacing.tabBarHeight, // 60px default
    borderTopWidth: 0, // No top border
    elevation: 0, // No shadow on Android
  },
});
