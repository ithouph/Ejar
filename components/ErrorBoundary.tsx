import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, Typography } from '@/constants/theme';
import { reloadAppAsync } from 'expo';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorFallback() {
  const { theme: colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundRoot },
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>Something went wrong</ThemedText>
        <ThemedText style={styles.message}>
          Ejar encountered an unexpected error. Try restarting the app.
        </ThemedText>
        <Button
          title="Restart Ejar"
          onPress={async () => {
            await reloadAppAsync();
          }}
          style={styles.button}
        />
      </View>
    </View>
  );
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.body.fontSize,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.md,
  },
});
