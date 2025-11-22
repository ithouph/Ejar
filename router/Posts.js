import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Posts from '../pages/Posts';
import AddPost from '../pages/AddPost';
import Reviews from '../pages/Reviews';

const Stack = createNativeStackNavigator();

export default function PostsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PostsHome" component={Posts} />
      <Stack.Screen name="AddPost" component={AddPost} />
      <Stack.Screen name="Reviews" component={Reviews} />
    </Stack.Navigator>
  );
}
