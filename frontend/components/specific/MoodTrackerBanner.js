import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../store/ThemeContext';

const { width } = Dimensions.get('window');

const MoodTrackerBanner = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const themedStyles = styles(theme);

  // Animation Value
  const translateX = useRef(new Animated.Value(0)).current;

  // The list of emojis to scroll
  const emojis = ['😊', '😐', '😔', '😡', '🤩'];
  // Duplicate the list to create a seamless loop effect
  const loopedEmojis = [...emojis, ...emojis, ...emojis]; 

  useEffect(() => {
    const startAnimation = () => {
      translateX.setValue(0);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -width, // Move left by the width of the screen
          duration: 9000, // Speed (lower = faster)
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

      {/**<View style={themedStyles.textContainer}>
              <Text style={[themedStyles.title, { color: theme.text }]}>Talk to me</Text>
              <Text style={[themedStyles.subtitle, { color: theme.secondaryText }]}>I'm your AI Assistant</Text> */}  
      <View style={themedStyles.headerRow}>
        {/* Top Line: Smaller "Click me" */}
        <Text style={[themedStyles.clickMeText, { color: theme.primary }]}>
            Click me
        </Text>
        
        {/* Bottom Line: Bold "Share your mood" */}
        <Text style={[themedStyles.shareText, { color: theme.text }]}>
            Share your mood
        </Text>
      </View>

      <View style={themedStyles.overflowContainer}>
        <Animated.View style={[themedStyles.emojiRow, { transform: [{ translateX }] }]}>
          {loopedEmojis.map((emoji, index) => (
            <Text key={index} style={themedStyles.emoji}>{emoji}</Text>
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
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // New Style for "Click me"
  clickMeText: {
    fontSize: 14,
    marginBottom: 4, // Small gap between lines
    fontWeight: '500',
  },
  // New Style for "Share your mood"
  shareText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overflowContainer: {
    width: '100%',
    overflow: 'hidden', // Ensures emojis don't spill out
    height: 40, 
    justifyContent: 'center',
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  emoji: {
    fontSize: 28,
    marginRight: 25, // Space between emojis
  },
});

export default MoodTrackerBanner;