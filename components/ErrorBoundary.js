import React, { Component } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { reloadAppAsync } from "expo";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Spacing } from "../theme/global";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught by boundary:", error, errorInfo);
  }

  handleReload = async () => {
    try {
      await reloadAppAsync();
    } catch (e) {
      console.log("Failed to reload app:", e);
    }
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ onReload }) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Oops!
      </ThemedText>
      <ThemedText type="body" style={styles.message}>
        Ejar encountered an unexpected error.
      </ThemedText>
      <Pressable style={styles.button} onPress={onReload}>
        <ThemedText type="body" style={styles.buttonText}>
          Start Fresh
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.md,
  },
  message: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: "rgba(37, 99, 235, 1)",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  buttonText: {
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "600",
  },
});

export default ErrorBoundary;
