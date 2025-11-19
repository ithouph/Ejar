import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Balance from '../pages/Balance';
import SupportChat from '../pages/SupportChat';

const Stack = createNativeStackNavigator();

export default function BalanceNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BalanceHome" component={Balance} />
      <Stack.Screen name="SupportChat" component={SupportChat} />
    </Stack.Navigator>
  );
}
