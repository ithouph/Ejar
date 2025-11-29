import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import DiscoverNavigator from "../router/Discover";
import PostsNavigator from "../router/Posts";
import SavedNavigator from "../router/Saved";
import SettingsNavigator from "../router/Settings";
import { TabBarIcon } from "./Navbar";
import { useTheme } from "../hooks/useTheme";
import { Spacing } from "../theme/global";

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: "Home", component: DiscoverNavigator, icon: "home" },
  { name: "Posts", component: PostsNavigator, icon: "edit-3" },
  { name: "Saved", component: SavedNavigator, icon: "heart" },
  { name: "Settings", component: SettingsNavigator, icon: "user" },
];

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: isDark ? `${theme.bg}CC` : `${theme.bg}E6` },
        ],
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView
            intensity={95}
            tint={isDark ? "dark" : "light"}
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Spacing.tabBarHeight || 70,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    elevation: 0,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
});
