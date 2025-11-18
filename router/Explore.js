import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Explore from '../pages/Explore';

const Stack = createNativeStackNavigator();

export default function ExploreNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ExploreHome" component={Explore} />
    </Stack.Navigator>
  );
}
