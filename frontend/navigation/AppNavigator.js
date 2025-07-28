import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import SuccessScreen from '../screens/Auth/SuccessScreen';
import AppointmentScreen from '../screens/Main/AppointmentScreen';
import PaymentScreen from '../screens/Main/PaymentScreen'; // <-- 1. Import the new screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="Appointment" component={AppointmentScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;
