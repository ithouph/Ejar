import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../pages/Profile';
import Account from '../pages/Account';
import EditProfile from '../pages/EditProfile';
import Balance from '../pages/Balance';
import Review from '../pages/Review';
import Support from '../pages/Support';

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Balance" component={Balance} />
      <Stack.Screen name="Review" component={Review} />
      <Stack.Screen name="Support" component={Support} />
    </Stack.Navigator>
  );
}
