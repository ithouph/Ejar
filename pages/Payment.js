import React, { useState } from "react";
import {
  View,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius } from "../theme/global";
import { paymentRequests } from "../services/database";

const PAYMENT_METHODS = [
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "mobile_money", label: "Mobile Money" },
  { id: "card", label: "Card Payment" },
];

export default function Payment({ route, navigation }) {
  const { post } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets();

  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [amount, setAmount] = useState("5000");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!transactionId.trim()) {
      Alert.alert("Error", "Please enter a transaction ID");
      return;
    }

    try {
      setLoading(true);

      const paymentRequest = await paymentRequests.create(
        user?.id,
        post.id,
        parseFloat(amount)
      );

      if (!paymentRequest) {
        Alert.alert("Error", "Failed to create payment request");
        return;
      }

      Alert.alert(
        "Payment Submitted",
        "Your payment request has been submitted for approval. Your post will be visible in Discover once approved.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("PostsHome");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting payment:", error);
      Alert.alert("Error", "Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={[
          {
            paddingTop: insets.top + Spacing.md,
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="x" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="h2">Payment</ThemedText>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: Spacing.xl }}>
          <ThemedText
            type="bodySmall"
            style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}
          >
            Post Title
          </ThemedText>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
            {post.title}
          </ThemedText>
          <ThemedText
            type="bodySmall"
            style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}
          >
            Once you complete payment, your post will be submitted for approval.
          </ThemedText>
        </View>

        <View style={{ marginBottom: Spacing.xl }}>
          <ThemedText
            type="bodySmall"
            style={[{ color: theme.textSecondary, marginBottom: Spacing.sm }]}
          >
            Payment Method
          </ThemedText>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => setPaymentMethod(method.id)}
              style={[
                {
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.md,
                  borderRadius: BorderRadius.md,
                  borderWidth: 1,
                  borderColor:
                    paymentMethod === method.id ? theme.primary : theme.border,
                  backgroundColor:
                    paymentMethod === method.id
                      ? theme.primary + "10"
                      : theme.surface,
                  marginBottom: Spacing.sm,
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={[
                  {
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor:
                      paymentMethod === method.id ? theme.primary : theme.border,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: Spacing.md,
                  },
                ]}
              >
                {paymentMethod === method.id && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: theme.primary,
                    }}
                  />
                )}
              </View>
              <ThemedText type="body">{method.label}</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={{ marginBottom: Spacing.xl }}>
          <ThemedText
            type="bodySmall"
            style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}
          >
            Amount (MRU)
          </ThemedText>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="5000"
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            style={[
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: BorderRadius.md,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.md,
                fontSize: 16,
              },
            ]}
          />
        </View>

        <View style={{ marginBottom: Spacing.xl }}>
          <ThemedText
            type="bodySmall"
            style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}
          >
            Transaction ID
          </ThemedText>
          <TextInput
            value={transactionId}
            onChangeText={setTransactionId}
            placeholder="Enter your transaction ID"
            placeholderTextColor={theme.textSecondary}
            style={[
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: BorderRadius.md,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.md,
                fontSize: 16,
              },
            ]}
          />
        </View>

        <View style={{ marginBottom: Spacing.xl }}>
          <ThemedText
            type="bodySmall"
            style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}
          >
            Notes (Optional)
          </ThemedText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional details"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
            style={[
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: BorderRadius.md,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.md,
                fontSize: 16,
              },
            ]}
          />
        </View>

        <Pressable
          onPress={handlePayment}
          disabled={loading}
          style={[
            {
              backgroundColor: theme.primary,
              paddingVertical: Spacing.lg,
              borderRadius: BorderRadius.lg,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Spacing.lg,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.background} />
          ) : (
            <ThemedText
              type="bodyLarge"
              style={{ color: theme.background, fontWeight: "600" }}
            >
              Submit Payment
            </ThemedText>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}
