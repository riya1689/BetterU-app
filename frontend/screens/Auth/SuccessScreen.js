import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../../store/ThemeContext'; // Assuming you have this

// Create animated components from Svg elements
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const SuccessScreen = ({ route, navigation }) => {
  const { message, nextScreen } = route.params;
  const { theme } = useTheme(); // Use your theme for colors

  // Animation values
  const circleRadius = 50;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const checkmarkPathLength = 70; // Approximate length of the checkmark path

  const circleProgress = useRef(new Animated.Value(0)).current;
  const checkmarkProgress = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // 1. Animate the circle drawing
      Animated.timing(circleProgress, {
        toValue: 1,
        duration: 500, // 0.5 seconds
        useNativeDriver: true,
      }),
      // 2. Animate the checkmark drawing
      Animated.timing(checkmarkProgress, {
        toValue: 1,
        duration: 300, // 0.3 seconds
        useNativeDriver: true,
      }),
      // 3. Fade in the text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300, // 0.3 seconds
        useNativeDriver: true,
      })
    ]).start(() => {
      // After animations complete, wait and navigate
      const timer = setTimeout(() => {
        navigation.replace(nextScreen);
      }, 1000); // Wait 1 seconds before navigating

      return () => clearTimeout(timer);
    });
  }, [navigation, nextScreen, circleProgress, checkmarkProgress, textOpacity]);

  // Interpolate progress values to strokeDashoffset
  const circleStrokeDashoffset = circleProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circleCircumference, 0],
  });

  const checkmarkStrokeDashoffset = checkmarkProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [checkmarkPathLength, 0],
  });

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <View style={styles.content}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background Circle */}
          <Circle
            cx="60"
            cy="60"
            r={circleRadius}
            stroke={theme.border}
            strokeWidth="5"
          />
          {/* Animated Progress Circle */}
          <AnimatedCircle
            cx="60"
            cy="60"
            r={circleRadius}
            stroke="#4ade80" // A nice green color
            strokeWidth="5"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleStrokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            originX="60"
            originY="60"
          />
          {/* Animated Checkmark Path */}
          <AnimatedPath
            d="M35 60 l20 20 l30 -40" // A simple path for the checkmark
            stroke="#4ade80" // Same green color
            strokeWidth="6"
            strokeDasharray={checkmarkPathLength}
            strokeDashoffset={checkmarkStrokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
        <Animated.Text style={[styles.message, { opacity: textOpacity }]}>
          {message}
        </Animated.Text>
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
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 30,
    textAlign: 'center',
  },
});

export default SuccessScreen;






// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const SuccessScreen = ({ route, navigation }) => {
//   // Get the message and next screen from the navigation parameters
//   const { message, nextScreen } = route.params;

//   useEffect(() => {
//     // Wait for 2 seconds, then navigate to the next screen
//     const timer = setTimeout(() => {
//       // 'replace' is used so the user can't go back to the success screen
//       navigation.replace(nextScreen); 
//     }, 2000); // 2000 milliseconds = 2 seconds

//     // Cleanup the timer if the component is unmounted
//     return () => clearTimeout(timer);
//   }, [navigation, nextScreen]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.content}>
//         <View style={styles.iconContainer}>
//           <Ionicons name="checkmark-sharp" size={60} color="#1e3a8a" />
//         </View>
//         <Text style={styles.message}>{message}</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f4f8',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//     borderWidth: 3,
//     borderColor: '#1e3a8a',
//   },
//   message: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1e3a8a',
//   },
// });

// export default SuccessScreen;
