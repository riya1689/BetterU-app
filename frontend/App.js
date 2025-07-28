import 'react-native-gesture-handler'; // Should be at the top
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext'; // 1. Import ThemeProvider
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      {/* 2. Wrap the app with ThemeProvider */}
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
