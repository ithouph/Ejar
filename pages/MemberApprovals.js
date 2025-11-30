import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useScreenInsets } from "../hooks/useScreenInsets";
import { Spacing, BorderRadius } from "../theme/global";
import { useAuth } from "../contexts/AuthContext";
import { users as usersApi, paymentRequests } from "../services/database";

export default function MemberApprovals({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    checkMemberStatus();
  }, [user]);

  const checkMemberStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const userProfile = await usersApi.getById(user.id);
      setIsMember(userProfile?.is_member || false);
      if (userProfile?.is_member) {
        await loadPendingPayments();
      }
    } catch (error) {
      console.error("Error checking member status:", error);
      setIsMember(false);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingPayments = async () => {
    try {
      const payments = await paymentRequests.getAllPending(50);
      setPendingPayments(payments || []);
    } catch (error) {
      console.error("Error loading pending payments:", error);
      setPendingPayments([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingPayments();
    setRefreshing(false);
  };

  const handleApprove = async (paymentId) => {
    setProcessingId(paymentId);
    try {
      await paymentRequests.approve(paymentId, "Approved by member");
      Alert.alert("Success", "Payment approved successfully");
      setPendingPayments(pendingPayments.filter((p) => p.id !== paymentId));
      setShowModal(false);
      setSelectedPayment(null);
    } catch (error) {
      Alert.alert("Error", "Failed to approve payment");
      console.error("Error approving payment:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async (paymentId) => {
    Alert.prompt(
      "Deny Payment",
      "Enter reason for denial:",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Deny",
          onPress: async (reason) => {
            setProcessingId(paymentId);
            try {
              await paymentRequests.deny(paymentId, reason || "No reason provided");
              Alert.alert("Success", "Payment denied successfully");
              setPendingPayments(pendingPayments.filter((p) => p.id !== paymentId));
              setShowModal(false);
              setSelectedPayment(null);
            } catch (error) {
              Alert.alert("Error", "Failed to deny payment");
              console.error("Error denying payment:", error);
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </ThemedView>
    );
  }

  if (!isMember) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.restrictedContainer,
            {
              paddingTop: insets.top + Spacing.xl,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="chevron-left" size={28} color={theme.textPrimary} />
            </Pressable>
            <ThemedText type="h1" style={styles.pageTitle}>
              Payment Approvals
            </ThemedText>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.restrictedContent}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.primary + "15" },
              ]}
            >
              <Feather
                name="lock"
                size={48}
                color={theme.primary}
              />
            </View>
            <ThemedText type="h2" style={styles.restrictedTitle}>
              Member Only Access
            </ThemedText>
            <ThemedText
              type="bodyMedium"
              style={[
                styles.restrictedText,
                { color: theme.textSecondary },
              ]}
            >
              You don't have access to view and manage payment approvals. This
              feature is available for verified members only.
            </ThemedText>
            <Pressable
              style={[
                styles.contactButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={() => navigation.goBack()}
            >
              <ThemedText
                type="bodyMedium"
                lightColor="#FFF"
                darkColor="#FFF"
              >
                Go Back
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  const renderPayment = ({ item }) => (
    <Pressable
      onPress={() => {
        setSelectedPayment(item);
        setShowModal(true);
      }}
      style={[
        styles.paymentCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <ThemedText type="bodyMedium" style={styles.paymentAmount}>
            MRU {item.amount}
          </ThemedText>
          <ThemedText
            type="caption"
            style={[styles.paymentDate, { color: theme.textSecondary }]}
          >
            {new Date(item.created_at).toLocaleDateString()}
          </ThemedText>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: "#f59e0b15" },
          ]}
        >
          <ThemedText
            type="caption"
            style={[styles.statusText, { color: "#f59e0b" }]}
          >
            Pending
          </ThemedText>
        </View>
      </View>
      <ThemedText type="caption" style={styles.paymentId}>
        ID: {item.id.substring(0, 8)}...
      </ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl * 2,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={28} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="h1" style={styles.pageTitle}>
            Payment Approvals
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <View
          style={[
            styles.statsContainer,
            { backgroundColor: theme.surface },
          ]}
        >
          <View style={styles.statItem}>
            <ThemedText type="bodySmall" style={styles.statLabel}>
              Pending
            </ThemedText>
            <ThemedText type="h2" style={styles.statValue}>
              {pendingPayments.length}
            </ThemedText>
          </View>
        </View>

        {pendingPayments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather
              name="check-circle"
              size={48}
              color={theme.textSecondary}
              opacity={0.5}
            />
            <ThemedText
              type="bodyMedium"
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              No pending payments
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={pendingPayments}
            renderItem={renderPayment}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          />
        )}
      </ScrollView>

      {/* Payment Detail Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowModal(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={[
              styles.modalContent,
              {
                paddingTop: insets.top + Spacing.lg,
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={28} color={theme.textPrimary} />
              </Pressable>
              <ThemedText type="h2">Payment Details</ThemedText>
              <View style={styles.placeholder} />
            </View>

            {selectedPayment && (
              <>
                {/* Payment Info */}
                <View
                  style={[
                    styles.detailCard,
                    { backgroundColor: theme.surface },
                  ]}
                >
                  <View style={styles.detailRow}>
                    <ThemedText
                      type="bodySmall"
                      style={styles.detailLabel}
                    >
                      Amount
                    </ThemedText>
                    <ThemedText type="bodyMedium" style={styles.detailValue}>
                      MRU {selectedPayment.amount}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.detailDivider,
                      { backgroundColor: theme.border },
                    ]}
                  />
                  <View style={styles.detailRow}>
                    <ThemedText
                      type="bodySmall"
                      style={styles.detailLabel}
                    >
                      Transaction ID
                    </ThemedText>
                    <ThemedText type="caption">{selectedPayment.id}</ThemedText>
                  </View>
                  <View
                    style={[
                      styles.detailDivider,
                      { backgroundColor: theme.border },
                    ]}
                  />
                  <View style={styles.detailRow}>
                    <ThemedText
                      type="bodySmall"
                      style={styles.detailLabel}
                    >
                      Status
                    </ThemedText>
                    <ThemedText
                      type="bodyMedium"
                      style={{ color: "#f59e0b" }}
                    >
                      Pending Review
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.detailDivider,
                      { backgroundColor: theme.border },
                    ]}
                  />
                  <View style={styles.detailRow}>
                    <ThemedText
                      type="bodySmall"
                      style={styles.detailLabel}
                    >
                      Submitted
                    </ThemedText>
                    <ThemedText type="caption">
                      {new Date(selectedPayment.created_at).toLocaleString()}
                    </ThemedText>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: "#ef4444",
                        opacity: processingId === selectedPayment.id ? 0.6 : 1,
                      },
                    ]}
                    onPress={() =>
                      handleDeny(selectedPayment.id)
                    }
                    disabled={processingId === selectedPayment.id}
                  >
                    {processingId === selectedPayment.id ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <>
                        <Feather name="x" size={20} color="#FFF" />
                        <ThemedText
                          type="bodyMedium"
                          lightColor="#FFF"
                          darkColor="#FFF"
                          style={{ marginLeft: Spacing.sm }}
                        >
                          Deny
                        </ThemedText>
                      </>
                    )}
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: "#10b981",
                        opacity: processingId === selectedPayment.id ? 0.6 : 1,
                      },
                    ]}
                    onPress={() =>
                      handleApprove(selectedPayment.id)
                    }
                    disabled={processingId === selectedPayment.id}
                  >
                    {processingId === selectedPayment.id ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <>
                        <Feather name="check" size={20} color="#FFF" />
                        <ThemedText
                          type="bodyMedium"
                          lightColor="#FFF"
                          darkColor="#FFF"
                          style={{ marginLeft: Spacing.sm }}
                        >
                          Approve
                        </ThemedText>
                      </>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  restrictedContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  backButton: {
    padding: Spacing.md,
    marginLeft: -Spacing.md,
  },
  pageTitle: {
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  restrictedContent: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  restrictedTitle: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  restrictedText: {
    textAlign: "center",
    marginBottom: Spacing.xl * 2,
    lineHeight: 24,
  },
  contactButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  statsContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.xl,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontWeight: "600",
  },
  paymentCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  paymentDate: {
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  statusText: {
    fontWeight: "600",
  },
  paymentId: {
    opacity: 0.7,
  },
  emptyContainer: {
    paddingVertical: Spacing.xl * 3,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  closeButton: {
    padding: Spacing.md,
    marginLeft: -Spacing.md,
  },
  detailCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.xl,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  detailLabel: {
    opacity: 0.7,
  },
  detailValue: {
    fontWeight: "600",
  },
  detailDivider: {
    height: 1,
    marginVertical: 0,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
