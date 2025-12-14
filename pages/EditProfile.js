import React, { useState, useEffect } from 'react';
import { View, Pressable, Image, TextInput, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { users as usersApi, cities as citiesApi } from '../services';

export default function EditProfile({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, profile, updateProfile } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [showCities, setShowCities] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [user, profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const citiesData = await citiesApi.getAll();
      setCities(citiesData);
      
      if (profile) {
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
        setWhatsapp(profile.whatsapp_number?.replace('+222', '') || '');
        setProfilePicture(profile.profile_photo_url || null);
        
        if (profile.city_id) {
          const city = citiesData.find(c => c.id === profile.city_id);
          setSelectedCity(city || null);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos to update your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Required', 'Please enter your last name');
      return;
    }
    if (!selectedCity) {
      Alert.alert('Required', 'Please select your city');
      return;
    }

    try {
      setSaving(true);
      
      const updates = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        whatsapp_number: whatsapp ? '+222' + whatsapp.replace(/[^\d]/g, '') : profile?.phone,
        city_id: selectedCity.id,
      };

      if (profilePicture && profilePicture !== profile?.profile_photo_url) {
        if (!profilePicture.startsWith('http')) {
          const photoUrl = await usersApi.uploadProfilePicture(user.id, profilePicture);
          updates.profile_photo_url = photoUrl;
        }
      }

      await updateProfile(updates);

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'member': '#22c55e',
      'ex_member': '#f59e0b',
      'leader': '#8b5cf6',
    };
    return colors[role] || theme.primary;
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: theme.border }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="x" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="h3" style={styles.headerTitle}>
            Edit Profile
          </ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="x" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="h3" style={styles.headerTitle}>
          Edit Profile
        </ThemedText>
        <Pressable 
          onPress={handleSave} 
          disabled={saving}
          style={styles.headerButton}
        >
          {saving ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <ThemedText type="body" style={{ color: theme.primary, fontWeight: '600' }}>
              Save
            </ThemedText>
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoSection}>
          <View style={styles.photoWrapper}>
            <Image
              source={{ uri: profilePicture || 'https://via.placeholder.com/120' }}
              style={styles.profilePhoto}
            />
            <Pressable 
              onPress={pickProfilePicture}
              style={[styles.cameraButton, { backgroundColor: theme.primary }]}
            >
              <Feather name="camera" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
          <Pressable onPress={pickProfilePicture}>
            <ThemedText type="body" style={{ color: theme.primary, fontWeight: '500' }}>
              Change Photo
            </ThemedText>
          </Pressable>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            PERSONAL INFORMATION
          </ThemedText>

          <View style={styles.inputGroup}>
            <View style={[styles.inputRow, { borderBottomColor: theme.border }]}>
              <ThemedText type="body" style={styles.inputLabel}>First Name</ThemedText>
              <TextInput
                style={[styles.inputValue, { color: theme.textPrimary }]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={[styles.inputRow, { borderBottomColor: theme.border }]}>
              <ThemedText type="body" style={styles.inputLabel}>Last Name</ThemedText>
              <TextInput
                style={[styles.inputValue, { color: theme.textPrimary }]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputRow}>
              <ThemedText type="body" style={styles.inputLabel}>Phone</ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {profile?.phone || 'Not set'}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            CONTACT
          </ThemedText>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <ThemedText type="body" style={styles.inputLabel}>WhatsApp</ThemedText>
              <View style={styles.phoneInputWrapper}>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>+222</ThemedText>
                <TextInput
                  style={[styles.phoneInput, { color: theme.textPrimary }]}
                  value={whatsapp}
                  onChangeText={(text) => setWhatsapp(text.replace(/[^\d]/g, ''))}
                  placeholder="12345678"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            LOCATION
          </ThemedText>

          <View style={styles.inputGroup}>
            <Pressable 
              onPress={() => setShowCities(!showCities)}
              style={[styles.inputRow, showCities ? null : null]}
            >
              <ThemedText type="body" style={styles.inputLabel}>City</ThemedText>
              <View style={styles.selectWrapper}>
                <ThemedText type="body" style={{ color: selectedCity ? theme.textPrimary : theme.textSecondary }}>
                  {selectedCity ? selectedCity.name : 'Select city'}
                </ThemedText>
                <Feather 
                  name={showCities ? 'chevron-up' : 'chevron-down'} 
                  size={18} 
                  color={theme.textSecondary} 
                />
              </View>
            </Pressable>
          </View>
        </View>

        {showCities && (
          <View style={[styles.citiesDropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ScrollView style={styles.citiesScroll} nestedScrollEnabled>
              {cities.map((city) => (
                <Pressable
                  key={city.id}
                  onPress={() => {
                    setSelectedCity(city);
                    setShowCities(false);
                  }}
                  style={[
                    styles.cityItem,
                    { borderBottomColor: theme.border },
                    selectedCity?.id === city.id && { backgroundColor: theme.primary + '15' }
                  ]}
                >
                  <View style={styles.cityInfo}>
                    <ThemedText type="body" style={{ fontWeight: selectedCity?.id === city.id ? '600' : '400' }}>
                      {city.name}
                    </ThemedText>
                    {city.region && (
                      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                        {city.region}
                      </ThemedText>
                    )}
                  </View>
                  {selectedCity?.id === city.id && (
                    <Feather name="check" size={18} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {profile?.role && profile.role !== 'normal' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <ThemedText type="caption" style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              ACCOUNT STATUS
            </ThemedText>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <ThemedText type="body" style={styles.inputLabel}>Role</ThemedText>
                <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(profile.role) + '20' }]}>
                  <View style={[styles.roleDot, { backgroundColor: getRoleBadgeColor(profile.role) }]} />
                  <ThemedText type="bodySmall" style={{ color: getRoleBadgeColor(profile.role), fontWeight: '600', textTransform: 'capitalize' }}>
                    {profile.role.replace('_', ' ')}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        )}

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveButton, { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }]}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check" size={20} color="#FFFFFF" />
              <ThemedText type="bodyLarge" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                Save Changes
              </ThemedText>
            </>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
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
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  photoSection: {
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  photoWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  section: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
  },
  sectionLabel: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  inputGroup: {
    paddingHorizontal: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 52,
  },
  inputLabel: {
    flex: 0.4,
    fontWeight: '500',
  },
  inputValue: {
    flex: 0.6,
    textAlign: 'right',
    fontSize: 16,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  phoneInput: {
    fontSize: 16,
    minWidth: 100,
    textAlign: 'right',
  },
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  citiesDropdown: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    overflow: 'hidden',
  },
  citiesScroll: {
    maxHeight: 250,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
  },
  cityInfo: {
    flex: 1,
    gap: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    gap: Spacing.xs,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.md,
  },
});
