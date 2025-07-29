import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../../store/ThemeContext'; // Correct path for a file in screens/Main
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const themedStyles = styles(theme);

  const handleNext = () => {
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={themedStyles.content}>
        <Image
          // --- FIX: Corrected the image path to go up two directories ---
          source={require('../../assets/images/BetterU_welcome_img-removebg-preview.png')}
          style={themedStyles.welcomeImage}
        />
        <Text style={[themedStyles.title, { color: theme.text }]}>Welcome to</Text>
        <Text style={[themedStyles.appName, { color: theme.primary }]}>
          𝓑𝓮𝓽𝓽𝓮𝓻𝓤
        </Text>
        <Text style={[themedStyles.tagline, { color: theme.secondaryText }]}>
          A space for your mental health clarity and support
        </Text>
      </View>

      <View style={themedStyles.footer}>
        <TouchableOpacity style={[themedStyles.nextButton, {backgroundColor: theme.primary}]} onPress={handleNext}>
          <Text style={themedStyles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
  },
  appName: {
    fontSize: 48,
    marginTop: 5,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'left',
    width: '100%',
    marginTop: 40,
    lineHeight: 28,
  },
  footer: {
    padding: 30,
    alignItems: 'flex-end',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default WelcomeScreen;
