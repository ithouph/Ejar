import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { ThemedText } from "./ThemedText";
import { Spacing } from "../theme/global";

export function TabBarIcon({ name, color, focused }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focused ? 1.1 : scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Feather name={name} size={24} color={color} />
    </Animated.View>
  );
}

export function SimpleHeader({ title, theme, onClose }) {
  return (
    <View style={[styles.simpleHeader, { backgroundColor: theme.bg }]}>
      <ThemedText type="h1" style={styles.simpleTitle}>
        {title}
      </ThemedText>
      {onClose ? (
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
    position: "relative",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  headerButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  simpleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  simpleTitle: {
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
