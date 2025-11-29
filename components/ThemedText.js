import React from "react";
import { Text } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Typography } from "../theme/global";

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  ...rest
}) {
  const { theme, isDark } = useTheme();

  const getColor = () => {
    if (isDark && darkColor) {
      return darkColor;
    }
    if (!isDark && lightColor) {
      return lightColor;
    }
    if (type === "link") {
      return theme.link;
    }
    return theme.textPrimary;
  };

  const getTypeStyle = () => {
    const typeMap = {
      display: Typography.display,
      h1: Typography.h1,
      h2: Typography.h2,
      bodyLarge: Typography.bodyLarge,
      body: Typography.body,
      bodySmall: Typography.bodySmall,
      caption: Typography.caption,
    };
    return typeMap[type] || Typography.body;
  };

  return (
    <Text style={[{ color: getColor() }, getTypeStyle(), style]} {...rest} />
  );
}
