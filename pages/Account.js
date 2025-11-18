import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, BorderRadius } from '../theme/global';
import { userData } from '../data/userData';

export default function Account({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    fullName: userData.profile.fullName,
    dateOfBirth: userData.profile.dateOfBirth,
    gender: userData.profile.gender,
    phone: userData.profile.phone,
    email: userData.profile.email,
    weight: userData.profile.weight,
    height: userData.profile.height,
  });

  const handleSave = () => {
    console.log('Profile updated:', formData);
    navigation.goBack();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <ThemedText type="h1" style={styles.title}>
          My Profile
        </ThemedText>

        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: userData.profile.photo }}
              style={styles.photo}
            />
            <Pressable style={[styles.editIcon, { backgroundColor: theme.primary }]}>
              <Feather name="camera" size={16} color="#FFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Basic Detail
          </ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Full name
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary }]}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Date of birth
            </ThemedText>
            <Pressable style={[styles.input, styles.pickerInput, { backgroundColor: theme.surface }]}>
              <ThemedText type="body">{formData.dateOfBirth}</ThemedText>
              <Feather name="chevron-down" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Gender
            </ThemedText>
            <View style={styles.genderRow}>
              <Pressable
                onPress={() => setFormData({ ...formData, gender: 'Male' })}
                style={[
                  styles.genderOption,
                  {
                    backgroundColor: formData.gender === 'Male' ? theme.primary + '20' : theme.surface,
                    borderColor: formData.gender === 'Male' ? theme.primary : theme.border,
                  },
                ]}
              >
                <View style={[styles.radio, { borderColor: theme.primary }]}>
                  {formData.gender === 'Male' && (
                    <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />
                  )}
                </View>
                <ThemedText type="body">Male</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setFormData({ ...formData, gender: 'Female' })}
                style={[
                  styles.genderOption,
                  {
                    backgroundColor: formData.gender === 'Female' ? theme.primary + '20' : theme.surface,
                    borderColor: formData.gender === 'Female' ? theme.primary : theme.border,
                  },
                ]}
              >
                <View style={[styles.radio, { borderColor: theme.primary }]}>
                  {formData.gender === 'Female' && (
                    <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />
                  )}
                </View>
                <ThemedText type="body">Female</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Contact Detail
          </ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Mobile number
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary }]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Email
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textSecondary }]}
              value={formData.email}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Personal Detail
          </ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Weight (kg)
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary }]}
              value={formData.weight}
              onChangeText={(text) => setFormData({ ...formData, weight: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
              Height (cm)
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.textPrimary }]}
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text })}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingBottom: insets.bottom + Spacing.md,
          },
        ]}
      >
        <Button onPress={handleSave}>Save</Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  title: {
    fontWeight: '700',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  pickerInput: {
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
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.small,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },
});
