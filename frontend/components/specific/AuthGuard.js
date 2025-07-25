import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const AuthGuard = ({ children }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  // State to control the visibility of the lock overlay
  const [showLock, setShowLock] = useState(false);
  // Animated value for a smooth fade-in effect
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer;
    // If the user is logged out...
    if (!user) {
      // ...wait for 3 seconds before showing the lock screen.
      timer = setTimeout(() => {
        setShowLock(true);
        // Fade in the lock screen smoothly
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500, // 0.5 second fade-in
          useNativeDriver: true,
        }).start();
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      // If the user is logged in, make sure the lock is hidden.
      setShowLock(false);
      opacity.setValue(0);
    }

    // Cleanup function: if the user navigates away before 3s, cancel the timer.
    return () => clearTimeout(timer);
  }, [user]); // This effect re-runs if the user's login status changes.

  return (
    <View style={styles.container}>
      {/* The original screen content is always in the background */}
      {children}

      {/* Conditionally render the lock overlay */}
      {showLock && (
        <Animated.View style={[{...StyleSheet.absoluteFillObject}, {opacity}]}>
          <BlurView intensity={80} tint="light" style={styles.container}>
            <View style={styles.overlay}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockTitle}>Feature Locked</Text>
              <Text style={styles.lockText}>
                Please log in or create an account to access this feature.
              </Text>
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginButtonText}>Log In / Sign Up</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  lockIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 10,
  },
  lockText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthGuard;
