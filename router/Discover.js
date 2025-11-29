import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Discover from "../pages/Discover";
import Pinned from "../pages/Pinned";
import Details from "../pages/Details";
import Feedback from "../pages/Feedback";
import PostDetail from "../pages/PostDetail";

const Stack = createNativeStackNavigator();

export default function DiscoverNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DiscoverHome" component={Discover} />
      <Stack.Screen name="Pinned" component={Pinned} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Feedback" component={Feedback} />
    </Stack.Navigator>
  );
}
