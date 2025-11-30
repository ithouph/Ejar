import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "../pages/Settings";
import Account from "../pages/Account";
import EditProfile from "../pages/EditProfile";
import Balance from "../pages/Balance";
import AddBalance from "../pages/AddBalance";
import Reviews from "../pages/Reviews";
import Support from "../pages/Support";
import FAQ from "../pages/FAQ";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Balance" component={Balance} />
      <Stack.Screen name="AddBalance" component={AddBalance} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="FAQ" component={FAQ} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Privacy" component={Privacy} />
    </Stack.Navigator>
  );
}
