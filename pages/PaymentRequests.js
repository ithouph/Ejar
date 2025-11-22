import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { paymentRequests as paymentRequestsApi } from '../services/database';

function PaymentRequestCard({ request, theme, onApprove, onReject, isProcessing }) {
  const date = new Date(request.created_at);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.warning || '#FFA500';
      case 'approved':
        return theme.success;
      case 'rejected':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'clock';
      case 'approved':
        return 'check-circle';
      case 'rejected':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={[styles.requestCard, { backgroundColor: theme.surface }]}>
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <ThemedText type="bodyLarge" style={styles.requestAmount}>
            {parseFloat(request.amount).toLocaleString()} MRU
          </ThemedText>
          <View style={styles.statusBadge}>
            <Feather
              name={getStatusIcon(request.status)}
              size={14}
              color={getStatusColor(request.status)}
            />
            <ThemedText
              type="caption"
              style={[styles.statusText, { color: getStatusColor(request.status) }]}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.requestDetails}>
        <ThemedText type="body" style={{ color: theme.textPrimary, marginBottom: Spacing.xs }}>
          {request.description || 'No description'}
        </ThemedText>
        
        {request.requester ? (
          <View style={styles.requesterInfo}>
            <Feather name="user" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
              From: {request.requester?.full_name || request.requester_name || 'Unknown'}
            </ThemedText>
          </View>
        ) : request.requester_name ? (
          <View style={styles.requesterInfo}>
            <Feather name="user" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
              From: {request.requester_name}
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.requesterInfo}>
          <Feather name="calendar" size={14} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {formattedDate}
          </ThemedText>
        </View>
      </View>

      {request.status === 'pending' ? (
        <View style={styles.actionButtons}>
          <Pressable
            onPress={() => onReject(request.id)}
            disabled={isProcessing}
            style={[
              styles.actionButton,
              styles.rejectButton,
              { backgroundColor: theme.error + '15', borderColor: theme.error }
            ]}
          >
            <Feather name="x" size={18} color={theme.error} />
            <ThemedText type="bodySmall" style={[styles.buttonText, { color: theme.error }]}>
              Reject
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => onApprove(request.id)}
            disabled={isProcessing}
            style={[
              styles.actionButton,
              styles.approveButton,
              { backgroundColor: theme.success + '15', borderColor: theme.success }
            ]}
          >
            <Feather name="check" size={18} color={theme.success} />
            <ThemedText type="bodySmall" style={[styles.buttonText, { color: theme.success }]}>
              Approve
            </ThemedText>
          </Pressable>
        </View>
      ) : request.approved_at ? (
        <View style={styles.approvedInfo}>
          <Feather name="info" size={14} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {request.status === 'approved' ? 'Approved' : 'Rejected'} on {new Date(request.approved_at).toLocaleDateString()}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

export default function PaymentRequests({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadPaymentRequests();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPaymentRequests = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const requestsData = await paymentRequestsApi.getAll();
      setRequests(requestsData);

      const statsData = await paymentRequestsApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading payment requests:', error);
      Alert.alert('Error', 'Failed to load payment requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    Alert.alert(
      'Approve Payment',
      'Are you sure you want to approve this payment request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              setProcessing(true);
              await paymentRequestsApi.approve(requestId);
              Alert.alert('Success', 'Payment request approved successfully!');
              await loadPaymentRequests();
            } catch (error) {
              console.error('Error approving payment request:', error);
              const message = error.message || 'Failed to approve payment request. Please try again.';
              Alert.alert('Error', message);
              await loadPaymentRequests();
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (requestId) => {
    Alert.alert(
      'Reject Payment',
      'Are you sure you want to reject this payment request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessing(true);
              await paymentRequestsApi.reject(requestId);
              Alert.alert('Success', 'Payment request rejected.');
              await loadPaymentRequests();
            } catch (error) {
              console.error('Error rejecting payment request:', error);
              const message = error.message || 'Failed to reject payment request. Please try again.';
              Alert.alert('Error', message);
              await loadPaymentRequests();
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Payment Requests</ThemedText>
          <View style={styles.headerButton} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Feather name="lock" size={48} color={theme.textSecondary} />
          <ThemedText type="bodyLarge" style={[styles.emptyText, { color: theme.textSecondary }]}>
            Please sign in to view payment requests
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Payment Requests</ThemedText>
          <View style={styles.headerButton} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="body" style={{ marginTop: Spacing.md, color: theme.textSecondary }}>
            Loading payment requests...
          </ThemedText>
        </View>
      </ThemedView>
    );
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
        <ThemedText type="bodyLarge">Payment Requests</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText type="h2" style={{ color: theme.textPrimary }}>
                {stats.total}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Total
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="h2" style={{ color: theme.warning || '#FFA500' }}>
                {stats.pending}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Pending
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="h2" style={{ color: theme.success }}>
                {stats.approved}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Approved
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="h2" style={{ color: theme.error }}>
                {stats.rejected}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Rejected
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'pending', 'approved', 'rejected'].map((filterOption) => (
              <Pressable
                key={filterOption}
                onPress={() => setFilter(filterOption)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filter === filterOption ? theme.primary : theme.surface,
                  }
                ]}
              >
                <ThemedText
                  type="bodySmall"
                  style={{
                    color: filter === filterOption ? '#fff' : theme.textPrimary,
                  }}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.requestsContainer}>
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color={theme.textSecondary} />
              <ThemedText type="bodyLarge" style={[styles.emptyText, { color: theme.textSecondary }]}>
                No {filter !== 'all' ? filter : ''} payment requests
              </ThemedText>
            </View>
          ) : (
            filteredRequests.map((request) => (
              <PaymentRequestCard
                key={request.id}
                request={request}
                theme={theme}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={processing}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  statsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  requestsContainer: {
    gap: Spacing.md,
  },
  requestCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  requestInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestAmount: {
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusText: {
    fontWeight: '500',
  },
  requestDetails: {
    marginBottom: Spacing.md,
  },
  requesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    borderWidth: 1,
  },
  rejectButton: {
    flex: 1,
  },
  approveButton: {
    flex: 1,
  },
  buttonText: {
    fontWeight: '600',
  },
  approvedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
