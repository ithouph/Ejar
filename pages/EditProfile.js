import React, { useState, useEffect } from 'react';
import { View, Pressable, Image, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, inputStyles, buttonStyles, layoutStyles, spacingStyles } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { Alert, ActivityIndicator } from 'react-native';

function InputField({ label, value, onChangeText, placeholder, keyboardType, theme }) {
  return (
    <View style={inputStyles.container}>
      <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <TextInput
        style={[inputStyles.input, { 
          backgroundColor: theme.surface, 
          color: theme.textPrimary,
          borderColor: theme.border 
        }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

function DatePickerField({ label, value, theme }) {
  return (
    <View style={inputStyles.container}>
      <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <Pressable style={[inputStyles.picker, { 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }]}>
        <ThemedText type="bodyLarge">{value}</ThemedText>
        <Feather name="chevron-down" size={20} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

function GenderSelector({ value, onSelect, theme }) {
  return (
    <View style={inputStyles.container}>
      <ThemedText type="bodySmall" style={[inputStyles.label, { color: theme.textSecondary }]}>
        Gender
      </ThemedText>
      <View style={[layoutStyles.row, spacingStyles.gapMd]}>
        <Pressable
          onPress={() => onSelect('Male')}
          style={[inputStyles.input, layoutStyles.rowCenter, spacingStyles.gapSm, { 
            flex: 1,
            backgroundColor: theme.surface,
            borderColor: value === 'Male' ? theme.primary : theme.border 
          }]}
        >
          <View style={[inputStyles.radio, { borderColor: value === 'Male' ? theme.primary : theme.border }]}>
            {value === 'Male' ? (
              <View style={[inputStyles.radioInner, { backgroundColor: theme.primary }]} />
            ) : null}
          </View>
          <ThemedText type="bodyLarge">Male</ThemedText>
        </Pressable>
        
        <Pressable
          onPress={() => onSelect('Female')}
          style={[inputStyles.input, layoutStyles.rowCenter, spacingStyles.gapSm, { 
            flex: 1,
            backgroundColor: theme.surface,
            borderColor: value === 'Female' ? theme.primary : theme.border 
          }]}
        >
          <View style={[inputStyles.radio, { borderColor: value === 'Female' ? theme.primary : theme.border }]}>
            {value === 'Female' ? (
              <View style={[inputStyles.radioInner, { backgroundColor: theme.primary }]} />
            ) : null}
          </View>
          <ThemedText type="bodyLarge">Female</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

export default function EditProfile({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('Select date');
  const [gender, setGender] = useState('Male');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const [profile, userDetails] = await Promise.all([
        userService.getProfile(user.id),
        userService.getUser(user.id)
      ]);
      
      if (profile) {
        setDateOfBirth(profile.date_of_birth || 'Select date');
        setGender(profile.gender || 'Male');
        setMobileNumber(profile.mobile || '');
        setWeight(profile.weight || '');
        setHeight(profile.height || '');
      }
      
      if (userDetails) {
        setFullName(userDetails.full_name || user.email || '');
      } else {
        setFullName(user.user_metadata?.full_name || user.email || '');
      }
      
      setEmail(user.email || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const existingProfile = await userService.getProfile(user.id);
      
      const profileData = {
        date_of_birth: dateOfBirth === 'Select date' ? null : dateOfBirth,
        gender,
        weight,
        height,
      };

      if (mobileNumber && mobileNumber.trim()) {
        profileData.mobile = mobileNumber;
      } else if (!existingProfile) {
        profileData.mobile = null;
      }
      
      if (existingProfile) {
        await userService.updateProfile(user.id, profileData);
      } else {
        await userService.createProfile(user.id, profileData);
      }

      if (fullName) {
        await userService.updateUser(user.id, {
          full_name: fullName,
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      
      await refreshUser();
      await loadUserProfile();

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      const message = error.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

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
          My Profile
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
              uri: user?.user_metadata?.avatar_url || 'https://via.placeholder.com/100'
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Pressable style={[buttonStyles.iconSmall, { 
            backgroundColor: theme.primary,
            position: 'absolute',
            bottom: Spacing.xl,
            right: '50%',
            marginRight: -60,
            borderWidth: 3,
            borderColor: '#FFF',
          }]}>
            <Feather name="edit-2" size={16} color="#FFF" />
          </Pressable>
        </View>

        <View style={[layoutStyles.sectionPadded, spacingStyles.pbXl]}>
          <ThemedText type="h3" style={{ fontWeight: '700', marginBottom: Spacing.xs }}>
            Basic Detail
          </ThemedText>

          <InputField
            label="Full name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            theme={theme}
          />

          <DatePickerField
            label="Date of birth"
            value={dateOfBirth}
            theme={theme}
          />

          <GenderSelector
            value={gender}
            onSelect={setGender}
            theme={theme}
          />
        </View>

        <View style={[layoutStyles.sectionPadded, spacingStyles.pbXl]}>
          <ThemedText type="h3" style={{ fontWeight: '700', marginBottom: Spacing.xs }}>
            Contact Detail
          </ThemedText>

          <InputField
            label="Mobile number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            theme={theme}
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            keyboardType="email-address"
            theme={theme}
          />
        </View>

        <View style={[layoutStyles.sectionPadded, spacingStyles.pbXl]}>
          <ThemedText type="h3" style={{ fontWeight: '700', marginBottom: Spacing.xs }}>
            Personal Detail
          </ThemedText>

          <InputField
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter weight"
            keyboardType="decimal-pad"
            theme={theme}
          />

          <InputField
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            placeholder="Enter height"
            keyboardType="decimal-pad"
            theme={theme}
          />
        </View>

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[buttonStyles.primaryLarge, spacingStyles.mxLg, spacingStyles.mtMd, { 
            backgroundColor: saving ? theme.textSecondary : theme.primary,
            marginBottom: Spacing['2xl'],
            opacity: saving ? 0.7 : 1
          }]}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText 
              type="bodyLarge" 
              lightColor="#FFF" 
              darkColor="#FFF"
              style={{ fontWeight: '600' }}
            >
              Save
            </ThemedText>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
}

