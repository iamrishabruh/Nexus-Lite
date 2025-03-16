import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Dashboard from "../screens/Dashboard";
import HealthForm from "../screens/HealthForm";
import AIInsights from "../screens/AIInsights";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: { token: string };
  HealthForm: { token: string };
  AIInsights: { token: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="HealthForm" component={HealthForm} />
        <Stack.Screen name="AIInsights" component={AIInsights} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
