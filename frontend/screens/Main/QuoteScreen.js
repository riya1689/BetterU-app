import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const QuoteScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const themedStyles = styles(theme);

  const handleNext = () => {
    // Replace the current screen with the main app so the user can't go back
    navigation.replace('MainTabs');
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/BetterU_hidingFace.png')} 
      style={themedStyles.container}
    >
      <SafeAreaView style={themedStyles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={themedStyles.content}>
          <Text style={themedStyles.quoteText}>
            “Mental health isn’t about hiding emotions — 
            It’s about understanding them.”
          </Text>
        </View>

        <View style={themedStyles.footer}>
          <TouchableOpacity style={themedStyles.nextButton} onPress={handleNext}>
            <Text style={themedStyles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward-circle" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
    justifyContent: 'space-between', // Pushes content and footer apart
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  quoteText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  footer: {
    padding: 30,
    alignItems: 'flex-end',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  nextButtonText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default QuoteScreen;
