import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Posts from '../pages/Posts';

const Stack = createNativeStackNavigator();

export default function PostsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PostsHome" component={Posts} />
    </Stack.Navigator>
  );
}
