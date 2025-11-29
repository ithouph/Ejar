import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius } from "../theme/global";
import { supportService } from "../services/supportService";

/**
 * ═══════════════════════════════════════════════════════════════════
 * SUPPORT CHAT PAGE - Add Balance Request
 * ═══════════════════════════════════════════════════════════════════
 *
 * Flow:
 * 1. User enters amount they want to add
 * 2. User uploads payment proof image
 * 3. Chat with support team (simulated)
 * 4. Support approves/denies (in backend)
 * 5. Balance added automatically if approved
 */

function MessageBubble({ message, isUser, theme }) {
  return (
    <View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.supportBubble,
        { backgroundColor: isUser ? theme.primary : theme.surface },
      ]}
    >
      {message.image_url && (
        <Image
          source={{ uri: message.image_url }}
          style={styles.messageImage}
          resizeMode="cover"
        />
      )}

      {message.message && (
        <ThemedText
          type="body"
          style={[
            styles.messageText,
            { color: isUser ? "rgba(255, 255, 255, 1)" : theme.textPrimary },
          ]}
        >
          {message.message}
        </ThemedText>
      )}

      <ThemedText
        type="caption"
        style={[
          styles.messageTime,
          { color: isUser ? "rgba(255, 255, 255, 1)99" : theme.textSecondary },
        ]}
      >
        {new Date(message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </ThemedText>
    </View>
  );
}

export default function SupportChat({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useScreenInsets();
  const flatListRef = useRef(null);

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [requestStatus, setRequestStatus] = useState("creating");

  useEffect(() => {
    if (paymentRequest?.id) {
      loadMessages();
    }
  }, [paymentRequest]);

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.errorContainer,
            {
              paddingTop: insets.top + Spacing.xl,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <Feather name="alert-circle" size={48} color={theme.textSecondary} />
          <ThemedText type="h2">Authentication Required</ThemedText>
          <ThemedText
            type="body"
            style={{ color: theme.textSecondary, textAlign: "center" }}
          >
            Please log in to add balance to your account.
          </ThemedText>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.primary }]}
          >
            <ThemedText type="body" style={{ color: "rgba(255, 255, 255, 1)" }}>
              Go Back
            </ThemedText>
          </Pressable>
        </KeyboardAwareScrollView>
      </ThemedView>
    );
  }

  async function loadMessages() {
    try {
      const msgs = await supportService.getMessages(paymentRequest.id);
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  async function handlePickImage() {
    try {
      const imageUri = await supportService.pickImage();
      if (imageUri) {
        setSelectedImage(imageUri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  }

  async function handleCreateRequest() {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedImage) {
      Alert.alert("Error", "Please upload payment proof");
      return;
    }

    try {
      setLoading(true);

      const request = await supportService.createPaymentRequest(
        user.id,
        parseFloat(amount),
        selectedImage,
        `Add balance request: $${amount}`,
      );

      setPaymentRequest(request);
      setRequestStatus("pending");

      const msg = await supportService.sendMessage(
        user.id,
        request.id,
        `I would like to add $${amount} to my account. Payment proof attached.`,
        selectedImage,
      );

      setMessages([msg]);
      setSelectedImage(null);

      Alert.alert(
        "Request Submitted",
        "Your payment request has been submitted. Our support team will review it shortly.",
      );
    } catch (error) {
      console.error("Error creating request:", error);
      Alert.alert("Error", "Failed to create request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!message.trim() && !selectedImage) {
      return;
    }

    if (!paymentRequest) {
      Alert.alert("Error", "Please create a payment request first");
      return;
    }

    try {
      const msg = await supportService.sendMessage(
        user.id,
        paymentRequest.id,
        message.trim(),
        selectedImage,
      );

      setMessages([...messages, msg]);
      setMessage("");
      setSelectedImage(null);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <ThemedText type="bodyLarge" style={styles.headerTitle}>
            Add Balance Request
          </ThemedText>
          {paymentRequest && (
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Status: {requestStatus}
            </ThemedText>
          )}
        </View>
        <View style={styles.headerButton} />
      </View>

      {!paymentRequest ? (
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.amountSection,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.amountCard, { backgroundColor: theme.surface }]}>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Amount to add
            </ThemedText>
            <View style={styles.amountInput}>
              <ThemedText type="h1">$</ThemedText>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.textPrimary }]}
              />
            </View>
          </View>

          <Pressable
            onPress={handlePickImage}
            style={[
              styles.uploadButton,
              {
                backgroundColor: selectedImage
                  ? theme.success + "20"
                  : theme.surface,
              },
            ]}
          >
            <Feather
              name={selectedImage ? "check-circle" : "image"}
              size={24}
              color={selectedImage ? theme.success : theme.textPrimary}
            />
            <ThemedText type="body">
              {selectedImage
                ? "Payment proof attached"
                : "Upload payment proof"}
            </ThemedText>
          </Pressable>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}

          <Pressable
            onPress={handleCreateRequest}
            disabled={loading}
            style={[styles.createButton, { backgroundColor: theme.primary }]}
          >
            {loading ? (
              <ActivityIndicator color="rgba(255, 255, 255, 1)" />
            ) : (
              <ThemedText
                type="bodyLarge"
                style={{ color: "rgba(255, 255, 255, 1)", fontWeight: "600" }}
              >
                Submit Request
              </ThemedText>
            )}
          </Pressable>
        </KeyboardAwareScrollView>
      ) : (
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isUser={item.sender_type === "user"}
                theme={theme}
              />
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImagePreview}
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setSelectedImage(null)}
                style={styles.removeImageButton}
              >
                <Feather name="x" size={16} color="rgba(255, 255, 255, 1)" />
              </Pressable>
            </View>
          )}

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.surface,
                paddingBottom: insets.bottom + Spacing.md,
              },
            ]}
          >
            <Pressable onPress={handlePickImage} style={styles.attachButton}>
              <Feather name="image" size={24} color={theme.textSecondary} />
            </Pressable>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.messageInput,
                {
                  backgroundColor: theme.backgroundRoot,
                  color: theme.textPrimary,
                },
              ]}
              multiline
              maxLength={500}
            />

            <Pressable
              onPress={handleSendMessage}
              style={[styles.sendButton, { backgroundColor: theme.primary }]}
              disabled={!message.trim() && !selectedImage}
            >
              <Feather name="send" size={20} color="rgba(255, 255, 255, 1)" />
            </Pressable>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.md,
  },
  amountSection: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  amountCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    gap: Spacing.md,
  },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.medium,
  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    height: 56,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: BorderRadius.small,
  },
  messageText: {
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  selectedImageContainer: {
    padding: Spacing.lg,
    position: "relative",
  },
  selectedImagePreview: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.small,
  },
  removeImageButton: {
    position: "absolute",
    top: Spacing.lg + 4,
    right: Spacing.lg + 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  messageInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
