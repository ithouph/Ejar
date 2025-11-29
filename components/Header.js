import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing } from "../theme/global";

export function Header({ userData, onSettingsPress, onFavoritePress }) {
  const { theme } = useTheme();

  const greetings = [
    "Explore amazing places",
    "Discover your next adventure",
    "Find your perfect stay",
    "Your journey starts here",
    "Ready for new experiences",
  ];

  const randomGreeting =
    greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftText}>
          <ThemedText style={styles.captionText}>{randomGreeting}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  captionText: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 34,
  },
  badgeText: {
    fontSize: 26,
    color: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontWeight: "700",
  },
  leftText: {
    flex: 1,
    flexDirection: "row",
  },
  rightIcons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
});
