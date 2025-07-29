import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, StatusBar } from 'react-native';
import { useTheme } from '../../store/ThemeContext'; // Correct path for a file in screens/Main

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const themedStyles = styles(theme);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      <View style={themedStyles.content}>
        <Image
          // --- FIX: Corrected the image path to go up two directories ---
          source={require('../../assets/images/BetterU_logo-removebg-preview.png')}
          style={themedStyles.logo}
        />
        <Text style={[themedStyles.appName, { color: theme.primary }]}>
          𝓑𝓮𝓽𝓽𝓮𝓻𝓤
        </Text>
      </View>
      <Text style={[themedStyles.tagline, { color: theme.secondaryText }]}>
        Better mind, Better health, Better life
      </Text>
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
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 50,
  },
});

export default SplashScreen;
