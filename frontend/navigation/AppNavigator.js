import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import SuccessScreen from '../screens/Auth/SuccessScreen';
import AppointmentScreen from '../screens/Main/AppointmentScreen';
import PaymentScreen from '../screens/Main/PaymentScreen';
import SplashScreen from '../screens/Main/SplashScreen';
// --- FIX: Corrected the import path for WelcomeScreen ---
import WelcomeScreen from '../screens/Main/WelcomeScreen';
import QuestionScreen from '../screens/Main/QuestionScreen'; // <-- 1. Import the new screen
import QuoteScreen from '../screens/Main/QuoteScreen'; // <-- 1. Import the new screen
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    // Set the initial route to 'Splash'
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      {/* --- All screens are now active --- */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
      <Stack.Screen name="Question" component={QuestionScreen} /> 
      <Stack.Screen name="Quote" component={QuoteScreen} /> 
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
