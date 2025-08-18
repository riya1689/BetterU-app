import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// --- Main and Auth Screens ---
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import SuccessScreen from '../screens/Auth/SuccessScreen';
import SplashScreen from '../screens/Main/SplashScreen';
import WelcomeScreen from '../screens/Main/WelcomeScreen';
import QuestionScreen from '../screens/Main/QuestionScreen';
import QuoteScreen from '../screens/Main/QuoteScreen';
import AppointmentScreen from '../screens/Main/AppointmentScreen';
import PaymentScreen from '../screens/Main/PaymentScreen';

// --- Login and Panel Screens ---
import AdminLoginScreen from '../screens/Auth/AdminLoginScreen';
import ExpertLoginScreen from '../screens/Auth/ExpertLoginScreen';
import AdminPanelScreen from '../screens/Main/AdminPanelScreen';
// --- FIX: Corrected this to match the file we created ---
import ExpertPanelScreen from '../screens/Main/ExpertPanelScreen'; 

// --- ADD THESE TWO LINES ---
import AdminSignupScreen from '../screens/Auth/AdminSignupScreen';
import DoctorSignupScreen from '../screens/Auth/DoctorSignupScreen';

import UserListScreen from '../screens/Main/UserListScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      {/* --- Splash and Onboarding --- */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
      <Stack.Screen name="Question" component={QuestionScreen} /> 
      <Stack.Screen name="Quote" component={QuoteScreen} /> 

      {/* --- Main App for Users --- */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Appointment" component={AppointmentScreen} /> 
      <Stack.Screen name="Payment" component={PaymentScreen} /> 

      {/* --- Authentication Flow --- */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="ExpertLogin" component={ExpertLoginScreen} />
      
      {/* --- ADD THESE TWO LINES --- */}
      <Stack.Screen name="AdminSignup" component={AdminSignupScreen} />
      <Stack.Screen name="DoctorSignup" component={DoctorSignupScreen} />


      {/* --- Panel Screens --- */}
      <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
      {/* --- FIX: Corrected this to match the file we created --- */}
      <Stack.Screen name="ExpertPanel" component={ExpertPanelScreen} />

      <Stack.Screen name="UserList" component={UserListScreen} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
