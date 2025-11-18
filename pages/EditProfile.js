import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Image, TextInput, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, BorderRadius } from '../theme/global';
import { userData } from '../data/userData';

function InputField({ label, value, onChangeText, placeholder, keyboardType, theme }) {
  return (
    <View style={styles.inputGroup}>
      <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <TextInput
        style={[styles.input, { 
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
    <View style={styles.inputGroup}>
      <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <Pressable style={[styles.input, styles.dateInput, { 
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
    <View style={styles.inputGroup}>
      <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
        Gender
      </ThemedText>
      <View style={styles.genderRow}>
        <Pressable
          onPress={() => onSelect('Male')}
          style={[styles.genderOption, { 
            backgroundColor: theme.surface,
            borderColor: value === 'Male' ? theme.primary : theme.border 
          }]}
        >
          <View style={[styles.radio, { borderColor: value === 'Male' ? theme.primary : theme.border }]}>
            {value === 'Male' ? (
              <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />
            ) : null}
          </View>
          <ThemedText type="bodyLarge">Male</ThemedText>
        </Pressable>
        
        <Pressable
          onPress={() => onSelect('Female')}
          style={[styles.genderOption, { 
            backgroundColor: theme.surface,
            borderColor: value === 'Female' ? theme.primary : theme.border 
          }]}
        >
          <View style={[styles.radio, { borderColor: value === 'Female' ? theme.primary : theme.border }]}>
            {value === 'Female' ? (
              <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />
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
  
  const [fullName, setFullName] = useState(userData.profile.fullName);
  const [dateOfBirth, setDateOfBirth] = useState(userData.profile.dateOfBirth);
  const [gender, setGender] = useState(userData.profile.gender);
  const [mobileNumber, setMobileNumber] = useState(userData.profile.phone);
  const [email, setEmail] = useState(userData.profile.email);
  const [weight, setWeight] = useState(userData.profile.weight);
  const [height, setHeight] = useState(userData.profile.height);

  const handleSave = () => {
    console.log('Saving profile...');
    navigation.goBack();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.background, paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="h2" style={styles.headerTitle}>
          My Profile
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profilePhotoContainer}>
          <Image
            source={{ uri: userData.profile.photo }}
            style={styles.profilePhoto}
          />
          <Pressable style={[styles.editPhotoButton, { backgroundColor: theme.primary }]}>
            <Feather name="edit-2" size={16} color="#FFF" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
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

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
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

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
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
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
        >
          <ThemedText 
            type="bodyLarge" 
            lightColor="#FFF" 
            darkColor="#FFF"
            style={styles.saveButtonText}
          >
            Save
          </ThemedText>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '600',
  },
  profilePhotoContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: '50%',
    marginRight: -60,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    fontSize: 16,
    borderWidth: 1,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  saveButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: '600',
  },
});
