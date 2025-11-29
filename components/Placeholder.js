import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Spacing } from "../theme/global";

export function Placeholder({ text }) {
  return (
    <View style={styles.container}>
      <ThemedText type="h2" style={styles.text}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  text: {
    textAlign: "center",
  },
});
