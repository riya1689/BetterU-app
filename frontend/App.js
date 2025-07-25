import 'react-native-gesture-handler'; // Should be at the top
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './store/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    // The AuthProvider wraps the entire app, making user data available everywhere
    <AuthProvider>
      <NavigationContainer>
        {/* The AppNavigator now controls the entire app's screen flow */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
