import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../store/ThemeContext';
// 1. IMPORT THE ICON LIBRARY
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MoodTrackerBanner = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const themedStyles = styles(theme);

  const translateX = useRef(new Animated.Value(0)).current;

  // 2. DEFINE ICON NAMES
  const moodIcons = [
    'emoticon-excited-outline',
    'emoticon-happy-outline',
    'emoticon-neutral-outline',
    'emoticon-sad-outline',
    'emoticon-angry-outline'
  ];

  // Duplicate for seamless loop
  const loopedIcons = [...moodIcons, ...moodIcons, ...moodIcons]; 

  useEffect(() => {
    const startAnimation = () => {
      translateX.setValue(0);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -width, 
          duration: 12000, // Slower for better visuals
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [translateX]);

  return (
    <TouchableOpacity 
      style={[themedStyles.container, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('MoodTracker')}
    >
      <View style={themedStyles.headerRow}>
        <Text style={[themedStyles.clickMeText, { color: theme.secondaryText }]}>
            Click me
        </Text>
        <Text style={[themedStyles.shareText, { color: theme.text }]}>
            Share your mood
        </Text>
      </View>

      <View style={themedStyles.overflowContainer}>
        <Animated.View style={[themedStyles.emojiRow, { transform: [{ translateX }] }]}>
          {loopedIcons.map((iconName, index) => (
            /* --- CRITICAL FIX HERE --- */
            /* We use MaterialCommunityIcons, NOT Text */
            <MaterialCommunityIcons 
                key={index} 
                name={iconName} 
                size={34} 
                color={theme.primary} 
                style={themedStyles.iconStyle}
            />
            /* ------------------------- */
          ))}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  headerRow: {
    paddingHorizontal: 15,
    marginBottom: 15, // Increased spacing slightly
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickMeText: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  shareText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overflowContainer: {
    width: '100%',
    overflow: 'hidden', 
    height: 50, // Increased height to fit icons comfortably
    justifyContent: 'center',
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  iconStyle: {
    marginRight: 40, // Increased space between icons so they don't look crowded
  },
});

export default MoodTrackerBanner;
