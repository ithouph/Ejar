import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Saved from "../pages/Saved";
import Details from "../pages/Details";

const Stack = createNativeStackNavigator();

export default function SavedNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SavedHome" component={Saved} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
}
