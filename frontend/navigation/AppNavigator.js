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
//import AdminSignupScreen from '../screens/Auth/AdminSignupScreen';
import DoctorSignupScreen from '../screens/Auth/DoctorSignupScreen';

import UserListScreen from '../screens/Main/UserListScreen';

// --- Payment Status Screen ---
import PaymentStatusScreen from '../screens/Auth/PaymentStatusScreen'; // Make sure the path is correct

import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import AdminJobManagerScreen from '../screens/Main/AdminJobManagerScreen';
import JobBoardScreen from '../screens/Main/JobBoardScreen';
import JobApplicationScreen from '../screens/Main/JobApplicationScreen';
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
      <Stack.Screen name="DoctorSignup" component={DoctorSignupScreen} />


      {/* --- Panel Screens --- */}
      <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
      {/* --- Job manager screen --- */}
      <Stack.Screen name="AdminJobManager" component={AdminJobManagerScreen} />
      
      {/* --- FIX: Corrected this to match the file we created --- */}
      <Stack.Screen name="ExpertPanel" component={ExpertPanelScreen} />

      <Stack.Screen name="UserList" component={UserListScreen} />

      {/* ---Payment Status Screen */}
      <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} options={{ headerShown: false }} />

      {/*Add the screen to your stack, inside the <Stack.Navigator>*/}
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />

      {/* ---Job Board Screen */}
      <Stack.Screen name="JobBoard" component={JobBoardScreen} />
      <Stack.Screen name="JobApplication" component={JobApplicationScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
