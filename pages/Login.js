import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import {
  Spacing,
  layoutStyles,
  inputStyles,
  spacingStyles,
  BorderRadius,
} from "../theme/global";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { auth, users as usersApi } from "../services/database";

const icons = [
  { name: "calendar", top: "15%", right: "20%" },
  { name: "map-pin", top: "25%", left: "25%" },
  { name: "wifi", top: "30%", right: "15%" },
  { name: "map", top: "45%", left: "10%" },
  { name: "search", top: "50%", right: "25%" },
  { name: "star", top: "65%", left: "20%" },
  { name: "users", top: "70%", right: "18%" },
];

const FloatingIcon = ({ icon, index, theme }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    const duration = 2000 + Math.random() * 1000; // Random duration between 2-3s
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.delay(index * 150).duration(1800)}
      style={[
        styles.iconBase,
        { top: icon.top, left: icon.left, right: icon.right },
        animatedStyle,
      ]}
    >
      <Feather
        name={icon.name}
        size={24}
        color={theme.textSecondary}
        opacity={0.15}
      />
    </Animated.View>
  );
};

export default function Login({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { directLogin, guestSignIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneInputFocused, setPhoneInputFocused] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleDirectLogin = async () => {
    if (phoneNumber.length < 8) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      await directLogin(phoneNumber);
    } catch (error) {
      Alert.alert("Error", error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setGuestLoading(true);
      await guestSignIn();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to continue as guest");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <ThemedView style={layoutStyles.container}>
      {/* Background Icons */}
      {icons.map((icon, index) => (
        <FloatingIcon key={index} icon={icon} index={index} theme={theme} />
      ))}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View
            style={[
              layoutStyles.column,
              { flex: 1, justifyContent: "space-between" },
              {
                paddingTop: insets.top + Spacing["3xl"],
                paddingBottom: insets.bottom + Spacing.xl + 60, // Add extra padding for the absolute footer
              },
            ]}
          >
            {/* Header Section */}
            <Animated.View
              entering={FadeInDown.delay(200)}
              style={spacingStyles.gapMd}
            >
              <View style={styles.logoContainer}>
                <Feather name="map" size={48} color={theme.primary} />
              </View>
              <View>
                <ThemedText type="display" style={styles.brandTitle}>
                  Ejar
                </ThemedText>
                <ThemedText
                  type="h2"
                  style={[styles.subTitle, { color: theme.textSecondary }]}
                >
                  {step === "phone"
                    ? "Enter your phone number"
                    : "Verify your number"}
                </ThemedText>
                <ThemedText
                  type="body"
                  style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
                >
                  {step === "phone"
                    ? "We'll send you a verification code."
                    : `Enter the code sent to ${phoneNumber}`}
                </ThemedText>
              </View>
            </Animated.View>

            {/* Form Section */}
            <View style={{ flex: 1, justifyContent: "center" }}>
              {step === "phone" ? (
                <Animated.View
                  exiting={SlideOutLeft}
                  style={spacingStyles.gapLg}
                >
                  <View style={styles.phoneInputContainer}>
                    <View
                      style={[
                        styles.countryCode,
                        { borderColor: theme.border, backgroundColor: theme.surface },
                      ]}
                    >
                      <ThemedText type="body" style={{ fontWeight: "600" }}>
                        +222
                      </ThemedText>
                    </View>
                    <TextInput
                      style={[
                        inputStyles.input,
                        {
                          flex: 1,
                          backgroundColor: theme.surface,
                          borderColor: phoneInputFocused ? theme.primary : theme.border,
                          borderWidth: phoneInputFocused ? 2 : 1,
                          color: theme.textPrimary,
                          paddingHorizontal: phoneInputFocused ? Spacing.md : Spacing.lg,
                        },
                      ]}
                      placeholder="(555) 123-4567"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      onFocus={() => setPhoneInputFocused(true)}
                      onBlur={() => setPhoneInputFocused(false)}
                    />
                  </View>

                  <Button
                    onPress={handleSendCode}
                    disabled={loading || phoneNumber.length < 8}
                  >
                    {loading ? <ActivityIndicator color="white" /> : "Send Code"}
                  </Button>
                </Animated.View>
              ) : (
                <Animated.View
                  entering={SlideInRight}
                  exiting={SlideOutRight}
                  style={spacingStyles.gapLg}
                >
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (otpRefs.current[index] = ref)}
                        style={[
                          styles.otpInput,
                          {
                            borderColor: digit ? theme.primary : theme.border,
                            backgroundColor: theme.surface,
                            color: theme.textPrimary,
                          },
                        ]}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={({ nativeEvent }) => {
                          if (
                            nativeEvent.key === "Backspace" &&
                            !digit &&
                            index > 0
                          ) {
                            otpRefs.current[index - 1].focus();
                          }
                        }}
                      />
                    ))}
                  </View>

                  <Button
                    onPress={handleVerifyOtp}
                    disabled={loading || otp.join("").length < 4}
                  >
                    {loading ? <ActivityIndicator color="white" /> : "Verify"}
                  </Button>

                  <Pressable
                    onPress={handleBack}
                    style={{ alignItems: "center", padding: Spacing.sm }}
                  >
                    <ThemedText
                      type="bodySmall"
                      style={{ color: theme.textSecondary }}
                    >
                      Wrong number?
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={handleGuestSignIn}
                    disabled={guestLoading}
                    style={{ alignItems: "center", padding: Spacing.sm }}
                  >
                    <ThemedText
                      type="bodySmall"
                      style={{ color: theme.primary, fontWeight: "600" }}
                    >
                      {guestLoading ? "Loading..." : "Continue as Guest"}
                    </ThemedText>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <Animated.View
        entering={FadeInDown.delay(400)}
        style={[
          spacingStyles.gapMd,
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
            backgroundColor: "transparent", // Ensure it doesn't block touches if transparent
          },
        ]}
      >
        <ThemedText
          type="caption"
          style={[styles.termsText, { color: theme.textSecondary }]}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  iconBase: {
    position: "absolute",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.md,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: Spacing.xs,
  },
  subTitle: {
    fontWeight: "400",
    opacity: 0.8,
  },
  phoneInputContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  countryCode: {
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    height: Spacing.inputHeight, // Match input height
    marginTop: 1, // Slight alignment fix if needed
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  termsText: {
    textAlign: "center",
    opacity: 0.6,
  },
});
