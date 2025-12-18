import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius, inputStyles } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { wallet as walletApi, users as usersApi, reports as reportsApi, notifications } from '../services';
import { useFocusEffect } from '@react-navigation/native';

function UserCard({ userData, theme, onPromote, onDemote, processing }) {
  const roleColors = {
    normal: theme.textSecondary,
    member: theme.primary,
    ex_member: theme.warning,
    leader: '#8b5cf6',
  };

  const roleLabels = {
    normal: 'Normal',
    member: 'Member',
    ex_member: 'Ex-Member',
    leader: 'Leader',
  };

  return (
    <View style={[styles.userCard, { backgroundColor: theme.surface }]}>
      <View style={styles.userHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
          <Feather name="user" size={20} color={theme.primary} />
        </View>
        <View style={styles.userInfo}>
          <ThemedText type="bodyLarge" style={{ fontWeight: '600' }}>
            {userData.firstName} {userData.lastName}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {userData.phone}
          </ThemedText>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: roleColors[userData.role] + '20' }]}>
          <ThemedText type="caption" style={{ color: roleColors[userData.role], fontWeight: '600' }}>
            {roleLabels[userData.role]}
          </ThemedText>
        </View>
      </View>

      <View style={styles.userStats}>
        <View style={styles.statBox}>
          <ThemedText type="bodyLarge" style={{ fontWeight: '600' }}>
            {userData.walletBalance?.toFixed(0) || 0}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            MRU
          </ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText type="bodyLarge" style={{ fontWeight: '600' }}>
            {userData.totalPostsCreated || 0}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            Posts
          </ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText type="bodyLarge" style={{ fontWeight: '600' }}>
            {userData.city?.name || 'N/A'}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            City
          </ThemedText>
        </View>
      </View>

      {userData.role === 'normal' ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => onPromote(userData, 'member')}
            disabled={processing}
            style={[styles.actionBtn, { backgroundColor: theme.primary }]}
          >
            <Feather name="shield" size={16} color="#FFFFFF" />
            <ThemedText type="caption" style={{ color: '#FFFFFF', fontWeight: '600' }}>
              Make Member
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => onPromote(userData, 'ex_member')}
            disabled={processing}
            style={[styles.actionBtn, { backgroundColor: theme.warning }]}
          >
            <Feather name="star" size={16} color="#FFFFFF" />
            <ThemedText type="caption" style={{ color: '#FFFFFF', fontWeight: '600' }}>
              Make Ex-Member
            </ThemedText>
          </Pressable>
        </View>
      ) : userData.role !== 'leader' ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => onDemote(userData)}
            disabled={processing}
            style={[styles.actionBtn, styles.demoteBtn, { borderColor: theme.error }]}
          >
            <Feather name="user-minus" size={16} color={theme.error} />
            <ThemedText type="caption" style={{ color: theme.error, fontWeight: '600' }}>
              Demote to Normal
            </ThemedText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function ReportCard({ report, theme, onApprove, onReject, processing }) {
  return (
    <View style={[styles.reportCard, { backgroundColor: theme.surface }]}>
      <View style={styles.reportHeader}>
        <View style={[styles.reportIcon, { backgroundColor: theme.error + '20' }]}>
          <Feather name="alert-circle" size={20} color={theme.error} />
        </View>
        <View style={styles.reportInfo}>
          <ThemedText type="bodyLarge" style={{ fontWeight: '600' }}>
            Unfair Rejection Report
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {report.reason}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.reportDetails, { borderColor: theme.border }]}>
        <View style={styles.reportRow}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>Reporter:</ThemedText>
          <ThemedText type="body" style={{ fontWeight: '500' }}>
            {report.reporter?.firstName} {report.reporter?.lastName}
          </ThemedText>
        </View>
        <View style={styles.reportRow}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>Member:</ThemedText>
          <ThemedText type="body" style={{ fontWeight: '500' }}>
            {report.reportedMember?.firstName} {report.reportedMember?.lastName}
          </ThemedText>
        </View>
        {report.transaction ? (
          <View style={styles.reportRow}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>Amount:</ThemedText>
            <ThemedText type="body" style={{ fontWeight: '500' }}>
              {report.transaction.amountMru?.toFixed(0)} MRU
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={() => onReject(report)}
          disabled={processing}
          style={[styles.actionBtn, styles.demoteBtn, { borderColor: theme.textSecondary }]}
        >
          <Feather name="x" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" style={{ color: theme.textSecondary, fontWeight: '600' }}>
            Dismiss
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => onApprove(report)}
          disabled={processing}
          style={[styles.actionBtn, { backgroundColor: theme.error }]}
        >
          <Feather name="check" size={16} color="#FFFFFF" />
          <ThemedText type="caption" style={{ color: '#FFFFFF', fontWeight: '600' }}>
            Charge 500 MRU
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

export default function LeaderDashboard({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('deposits');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [leaderDeposits, setLeaderDeposits] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (user && profile && profile.role === 'leader') {
        loadData();
      } else {
        setLoading(false);
      }
    }, [user, profile])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [deposits, reports] = await Promise.all([
        walletApi.getLeaderPendingDeposits(),
        reportsApi.getPending()
      ]);
      setLeaderDeposits(deposits);
      setPendingReports(reports);
    } catch (error) {
      console.error('Error loading leader data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const results = await usersApi.searchByPhone(searchQuery.trim());
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userData, role) => {
    const roleName = role === 'member' ? 'Member' : 'Ex-Member';
    const costInfo = role === 'member' 
      ? 'User must have at least 1,000 MRU balance.' 
      : '2,000 MRU will be deducted from user wallet.';

    Alert.alert(
      `Promote to ${roleName}`,
      `Are you sure you want to promote ${userData.firstName} to ${roleName}?\n\n${costInfo}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Promote',
          onPress: async () => {
            try {
              setProcessing(userData.id);
              if (role === 'member') {
                await usersApi.promoteToMember(userData.id, user.id);
              } else {
                await usersApi.promoteToExMember(userData.id, user.id);
              }
              await notifications.notifyRolePromotion(userData.id, role, profile?.firstName || 'Leader');
              Alert.alert('Success', `${userData.firstName} has been promoted to ${roleName}`);
              handleSearch();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to promote user');
            } finally {
              setProcessing(null);
            }
          }
        }
      ]
    );
  };

  const handleDemote = async (userData) => {
    Alert.alert(
      'Demote to Normal',
      `Are you sure you want to demote ${userData.firstName} to Normal user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Demote',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessing(userData.id);
              await usersApi.demoteToNormal(userData.id, user.id, 'Leader decision');
              Alert.alert('Done', `${userData.firstName} has been demoted to Normal`);
              handleSearch();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to demote user');
            } finally {
              setProcessing(null);
            }
          }
        }
      ]
    );
  };

  const handleApproveDeposit = async (deposit) => {
    try {
      setProcessing(deposit.id);
      await walletApi.approveDeposit(deposit.id, user.id, true);
      await notifications.notifyPaymentApproved(deposit.userId, deposit.amountMru);
      Alert.alert('Success', 'Deposit approved');
      await loadData();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to approve deposit');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectDeposit = async (deposit) => {
    try {
      setProcessing(deposit.id);
      await walletApi.rejectDeposit(deposit.id, user.id, 'Leader rejection', true);
      await notifications.notifyPaymentRejected(deposit.userId, deposit.amountMru, 'Rejected by leader');
      Alert.alert('Done', 'Deposit rejected');
      await loadData();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reject deposit');
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveReport = async (report) => {
    Alert.alert(
      'Approve Report',
      `This will charge the member 500 MRU penalty. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Charge Penalty',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessing(report.id);
              await reportsApi.approve(report.id, user.id);
              Alert.alert('Done', 'Report approved and penalty charged');
              await loadData();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to approve report');
            } finally {
              setProcessing(null);
            }
          }
        }
      ]
    );
  };

  const handleRejectReport = async (report) => {
    try {
      setProcessing(report.id);
      await reportsApi.reject(report.id, user.id);
      Alert.alert('Done', 'Report dismissed');
      await loadData();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to dismiss report');
    } finally {
      setProcessing(null);
    }
  };

  if (!user || !profile) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Leader Dashboard</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.centerContent}>
          <Feather name="log-in" size={48} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
            Please log in
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (profile.role !== 'leader') {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Leader Dashboard</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.centerContent}>
          <Feather name="shield-off" size={48} color={theme.textSecondary} />
          <ThemedText type="h2" style={{ marginTop: Spacing.lg, textAlign: 'center' }}>
            Leader Access Required
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md, textAlign: 'center' }}>
            Only leaders can access this dashboard.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge">Leader Dashboard</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.tabBar}>
        {['deposits', 'reports', 'users'].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: theme.primary, borderBottomWidth: 2 }
            ]}
          >
            <Feather 
              name={tab === 'deposits' ? 'dollar-sign' : tab === 'reports' ? 'alert-triangle' : 'users'} 
              size={18} 
              color={activeTab === tab ? theme.primary : theme.textSecondary} 
            />
            <ThemedText 
              type="body" 
              style={{ color: activeTab === tab ? theme.primary : theme.textSecondary, fontWeight: activeTab === tab ? '600' : '400' }}
            >
              {tab === 'deposits' ? `Deposits (${leaderDeposits.length})` : tab === 'reports' ? `Reports (${pendingReports.length})` : 'Users'}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : activeTab === 'deposits' ? (
          leaderDeposits.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color={theme.textSecondary} />
              <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
                No escalated deposits
              </ThemedText>
            </View>
          ) : (
            leaderDeposits.map((deposit) => (
              <View key={deposit.id} style={[styles.depositCard, { backgroundColor: theme.surface }]}>
                <View style={styles.depositHeader}>
                  <ThemedText type="bodyLarge" style={{ fontWeight: '600' }}>
                    {deposit.user?.firstName} {deposit.user?.lastName}
                  </ThemedText>
                  <ThemedText type="bodyLarge" style={{ color: theme.primary, fontWeight: '700' }}>
                    {deposit.amountMru?.toFixed(0)} MRU
                  </ThemedText>
                </View>
                <ThemedText type="caption" style={{ color: theme.warning }}>
                  No qualified member in city - escalated to leader
                </ThemedText>
                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => handleRejectDeposit(deposit)}
                    disabled={processing === deposit.id}
                    style={[styles.actionBtn, styles.demoteBtn, { borderColor: theme.error }]}
                  >
                    <ThemedText type="caption" style={{ color: theme.error }}>Reject</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={() => handleApproveDeposit(deposit)}
                    disabled={processing === deposit.id}
                    style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                  >
                    <ThemedText type="caption" style={{ color: '#FFFFFF' }}>Approve</ThemedText>
                  </Pressable>
                </View>
              </View>
            ))
          )
        ) : activeTab === 'reports' ? (
          pendingReports.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="check-circle" size={48} color={theme.success} />
              <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
                No pending reports
              </ThemedText>
            </View>
          ) : (
            pendingReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                theme={theme}
                onApprove={handleApproveReport}
                onReject={handleRejectReport}
                processing={processing === report.id}
              />
            ))
          )
        ) : (
          <View style={styles.usersTab}>
            <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
              <Feather name="search" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.textPrimary }]}
                placeholder="Search by phone number..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                keyboardType="phone-pad"
              />
              <Pressable onPress={handleSearch} style={[styles.searchBtn, { backgroundColor: theme.primary }]}>
                <ThemedText type="caption" style={{ color: '#FFFFFF' }}>Search</ThemedText>
              </Pressable>
            </View>

            {searchResults.length > 0 ? (
              searchResults.map((userData) => (
                <UserCard
                  key={userData.id}
                  userData={userData}
                  theme={theme}
                  onPromote={handlePromote}
                  onDemote={handleDemote}
                  processing={processing === userData.id}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="users" size={48} color={theme.textSecondary} />
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md, textAlign: 'center' }}>
                  Search for users by phone number to manage roles
                </ThemedText>
              </View>
            )}
          </View>
        )}
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  depositCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  depositHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  statBox: {
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
  },
  demoteBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  reportCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportInfo: {
    flex: 1,
  },
  reportDetails: {
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usersTab: {
    gap: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  searchBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
  },
});
