import React from "react";
import { View } from "react-native";
import { useTheme } from "../hooks/useTheme";

export function ThemedView({ style, lightColor, darkColor, ...otherProps }) {
  const { theme, isDark } = useTheme();

  const backgroundColor =
    isDark && darkColor
      ? darkColor
      : !isDark && lightColor
        ? lightColor
        : theme.bg;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
