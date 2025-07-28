import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext'; // 1. Import useTheme
import Card from '../../components/common/Card';
import FeatureCard from '../../components/specific/FeatureCard';
import AppHeader from '../../components/specific/AppHeader';

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme(); // 2. Get the theme object

  const greeting = getGreeting();
  const displayName = user ? user.name.split(' ')[0] : 'There';

  const handlePress = (screenName) => {
    if (screenName) {
      navigation.navigate(screenName);
    } else {
      console.log('Feature coming soon!');
    }
  };

  // 3. Pass the theme to the styles function
  const themedStyles = styles(theme);

  return (
    // 4. Apply dynamic theme colors to the components
    <SafeAreaView style={[themedStyles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader />
      
      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        <Text style={[themedStyles.greeting, { color: theme.primary }]}>{greeting}, {displayName}</Text>
        <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>How are you feeling today?</Text>
        
        <Card style={{ marginBottom: 20, backgroundColor: theme.card }}>
          <Text style={[themedStyles.cardTitle, { color: theme.primary }]}>Your Daily Check-in</Text>
          <Text style={[themedStyles.cardText, { color: theme.text }]}>
            A moment of reflection is a step towards wellness. Let's start your day with intention.
          </Text>
        </Card>

        <View style={themedStyles.featureGrid}>
          <FeatureCard 
            icon="📅" 
            title="Book a Session" 
            onPress={() => handlePress('Counseling')} 
          />
          <FeatureCard 
            icon="🤖" 
            title="AI Assistant" 
            onPress={() => handlePress('AI Chat')} 
          />
          <FeatureCard 
            icon="🧘" 
            title="Meditation" 
            onPress={() => handlePress('Meditate')} 
          />
          <FeatureCard 
            icon="📝" 
            title="Self-Assess" 
            onPress={() => handlePress('Assess')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- 5. IMPORTANT CHANGE: Convert styles to a function ---
const styles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
