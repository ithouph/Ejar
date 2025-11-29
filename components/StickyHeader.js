import React from "react";
import { View, Pressable, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { Spacing, stickyHeaderStyles as styles } from "../theme/global";

export function StickyHeader({
  title,
  theme,
  scrollY = 0,
  insets,
  actionIcon,
  onAction,
}) {
  const scrollProgress = Math.min(scrollY / 50, 1);
  const blurIntensity = 80 + scrollProgress * 15;
  const titleScale = 1 - scrollProgress * 0.15;
  const fontSize = 24 - scrollProgress * 3;

  return (
    <BlurView
      intensity={blurIntensity}
      style={[styles.stickyHeader, { paddingTop: insets?.top || 0 }]}
    >
      <View
        style={[
          styles.headerContent,
          {
            backgroundColor: scrollProgress > 0.5 ? theme.bg : `${theme.bg}CC`,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.title,
            {
              color: theme.textPrimary,
              fontSize,
              transform: [{ scale: titleScale }],
              marginLeft: scrollProgress > 0.5 ? 0 : Spacing.lg,
              textAlign: scrollProgress > 0.5 ? "center" : "left",
              flex: 1,
            },
          ]}
        >
          {title}
        </Animated.Text>

        {actionIcon && onAction && (
          <Pressable onPress={onAction} style={styles.actionButton} hitSlop={8}>
            <Feather name={actionIcon} size={24} color={theme.textPrimary} />
          </Pressable>
        )}
      </View>
    </BlurView>
  );
}
