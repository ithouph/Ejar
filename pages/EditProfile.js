import React, { useState, useEffect } from 'react';
import { View, Pressable, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, inputStyles, buttonStyles, layoutStyles, spacingStyles, BorderRadius } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { users as usersApi, cities as citiesApi } from '../services/database';

function InputField({ label, value, onChangeText, placeholder, keyboardType, theme, editable = true }) {
  return (
    <View style={inputStyles.container}>
      <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <TextInput
        style={[inputStyles.input, { 
          backgroundColor: theme.surface, 
          color: editable ? theme.textPrimary : theme.textSecondary,
          borderColor: theme.border 
        }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={keyboardType || 'default'}
        editable={editable}
      />
    </View>
  );
}

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

  if (loading) {
    return (
      <ThemedView style={layoutStyles.container}>
        <View style={[layoutStyles.header, { 
          backgroundColor: theme.background, 
          paddingTop: insets.top + Spacing.md,
          justifyContent: 'space-between' 
        }]}>
          <Pressable onPress={() => navigation.goBack()} style={buttonStyles.icon}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="h2" style={{ fontWeight: '600' }}>
            Edit Profile
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={layoutStyles.container}>
      <View style={[layoutStyles.header, { 
        backgroundColor: theme.background, 
        paddingTop: insets.top + Spacing.md,
        justifyContent: 'space-between' 
      }]}>
        <Pressable onPress={() => navigation.goBack()} style={buttonStyles.icon}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="h2" style={{ fontWeight: '600' }}>
          Edit Profile
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[spacingStyles.pbXl, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[layoutStyles.columnCenter, spacingStyles.pyXl]}>
          <Image
            source={{ 
              uri: profilePicture || 'https://via.placeholder.com/100'
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Pressable 
            onPress={pickProfilePicture}
            style={[buttonStyles.iconSmall, { 
              backgroundColor: theme.primary,
              position: 'absolute',
              bottom: Spacing.xl,
              right: '35%',
            }]}
          >
            <Feather name="camera" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={[spacingStyles.phLg, spacingStyles.gapLg]}>
          <InputField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            theme={theme}
          />

          <InputField
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            theme={theme}
          />

          <View style={inputStyles.container}>
            <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
              Phone Number
            </ThemedText>
            <View style={[inputStyles.input, { 
              backgroundColor: theme.surface, 
              borderColor: theme.border,
              opacity: 0.7,
            }]}>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {profile?.phone || 'Not set'}
              </ThemedText>
            </View>
          </View>

          <View style={inputStyles.container}>
            <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
              WhatsApp Number
            </ThemedText>
            <View style={[styles.phoneInputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <ThemedText type="body" style={styles.countryCode}>+222</ThemedText>
              <TextInput
                value={whatsapp}
                onChangeText={(text) => setWhatsapp(text.replace(/[^\d]/g, ''))}
                placeholder="12345678"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
                style={[styles.phoneInput, { color: theme.textPrimary }]}
                maxLength={10}
              />
            </View>
          </View>

          <View style={inputStyles.container}>
            <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
              City
            </ThemedText>
            <Pressable
              onPress={() => setShowCities(!showCities)}
              style={[styles.selectButton, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border 
              }]}
            >
              <ThemedText type="body" style={{ color: selectedCity ? theme.textPrimary : theme.textSecondary }}>
                {selectedCity ? selectedCity.name : 'Select your city'}
              </ThemedText>
              <Feather 
                name={showCities ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={theme.textSecondary} 
              />
            </Pressable>
            
            {showCities && (
              <ScrollView 
                style={[styles.citiesList, { backgroundColor: theme.surface, borderColor: theme.border }]}
                nestedScrollEnabled
              >
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
                      selectedCity?.id === city.id && { backgroundColor: theme.surfaceHover }
                    ]}
                  >
                    <ThemedText type="body">{city.name}</ThemedText>
                    {city.region && (
                      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                        {city.region}
                      </ThemedText>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          {profile?.role && profile.role !== 'normal' && (
            <View style={inputStyles.container}>
              <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
                Role
              </ThemedText>
              <View style={[inputStyles.input, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
              }]}>
                <ThemedText type="body" style={{ color: theme.primary, textTransform: 'capitalize' }}>
                  {profile.role.replace('_', ' ')}
                </ThemedText>
              </View>
            </View>
          )}

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={[buttonStyles.primary, { 
              backgroundColor: theme.primary, 
              opacity: saving ? 0.6 : 1,
              marginTop: Spacing.xl,
            }]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText type="body" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                Save Changes
              </ThemedText>
            )}
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = {
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  countryCode: {
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  phoneInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
  },
  citiesList: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.xs,
    maxHeight: 200,
  },
  cityItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
};
