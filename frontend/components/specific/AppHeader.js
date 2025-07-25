import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AppHeader = () => {
  const navigation = useNavigation();

  // This function will handle the login press.
  const onLoginPress = () => {
    // This now navigates to the full-page Login screen
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      {/* Left Side: App Logo */}
      <Text style={styles.logo}>BetterU</Text>

      {/* Right Side: Buttons */}
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLoginPress}>
          <Image 
            source={{ uri: 'https://placehold.co/100x100/E0E0E0/333?text= ' }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f4f8', // Match the screen background
    width: '100%',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a', // Our theme color
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loginText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default AppHeader;
