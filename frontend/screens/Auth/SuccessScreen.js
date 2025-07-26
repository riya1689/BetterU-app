import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SuccessScreen = ({ route, navigation }) => {
  // Get the message and next screen from the navigation parameters
  const { message, nextScreen } = route.params;

  useEffect(() => {
    // Wait for 2 seconds, then navigate to the next screen
    const timer = setTimeout(() => {
      // 'replace' is used so the user can't go back to the success screen
      navigation.replace(nextScreen); 
    }, 2000); // 2000 milliseconds = 2 seconds

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigation, nextScreen]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-sharp" size={60} color="#1e3a8a" />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#1e3a8a',
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
});

export default SuccessScreen;
