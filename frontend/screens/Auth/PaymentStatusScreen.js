import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';

// Animated SVG components for the success animation
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const PaymentStatusScreen = ({ route, navigation }) => {
  const { status, message, nextScreen } = route.params; // 'success' or 'fail'
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Countdown state
  const [countdown, setCountdown] = useState(5);

  // Animation values for success animation
  const circleRadius = 50;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const checkmarkPathLength = 70;
  const circleProgress = useRef(new Animated.Value(0)).current;
  const checkmarkProgress = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start success animation only if status is 'success'
    if (status === 'success') {
      Animated.sequence([
        Animated.timing(circleProgress, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(checkmarkProgress, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      // For fail, just fade in the text
      Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }

    // Countdown timer logic
    const timerInterval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timerInterval);
          navigation.replace(nextScreen);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timerInterval);
  }, [navigation, nextScreen, status]);

  // Interpolated values for SVG animation
  const circleStrokeDashoffset = circleProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, 0],
  });
  const checkmarkStrokeDashoffset = checkmarkProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [checkmarkPathLength, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <View style={styles.content}>
        {status === 'success' ? (
          // Success Animation
          <Svg width="120" height="120" viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r={circleRadius} stroke={theme.border} strokeWidth="5" />
            <AnimatedCircle
              cx="60" cy="60" r={circleRadius} stroke="#4ade80" strokeWidth="5"
              strokeDasharray={circleCircumference} strokeDashoffset={circleStrokeDashoffset}
              strokeLinecap="round" rotation="-90" originX="60" originY="60"
            />
            <AnimatedPath
              d="M35 60 l20 20 l30 -40" stroke="#4ade80" strokeWidth="6"
              strokeDasharray={checkmarkPathLength} strokeDashoffset={checkmarkStrokeDashoffset}
              strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
          </Svg>
        ) : (
          // Failure Icon
          <View style={[styles.iconContainer, { borderColor: '#ef4444' }]}>
            <Ionicons name="close-sharp" size={60} color="#ef4444" />
          </View>
        )}
        <Animated.Text style={[styles.message, { opacity: textOpacity }]}>
          {message}
        </Animated.Text>
        <Text style={styles.countdownText}>
          Redirecting in {countdown} seconds...
        </Text>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 30,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 16,
    color: theme.secondaryText,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default PaymentStatusScreen;
