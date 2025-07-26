import React from 'react';
// --- FIX: Added SafeAreaView to the import list ---
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext'; // 1. Import useAuth
import Card from '../../components/common/Card';
import FeatureCard from '../../components/specific/FeatureCard';
import AppHeader from '../../components/specific/AppHeader';

// --- Helper function to get the correct greeting ---
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
  const { user } = useAuth(); // 2. Get the user from our context

  // 3. Determine the greeting and name dynamically
  const greeting = getGreeting();
  // If the user exists, get their first name. Otherwise, use "There".
  const displayName = user ? user.name.split(' ')[0] : 'There';

  const handlePress = (screenName) => {
    if (screenName) {
      navigation.navigate(screenName);
    } else {
      console.log('Feature coming soon!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- 4. Use the new dynamic values --- */}
        <Text style={styles.greeting}>{greeting}, {displayName}</Text>
        <Text style={styles.subHeader}>How are you feeling today?</Text>
        
        <Card style={{ marginBottom: 20 }}>
          <Text style={styles.cardTitle}>Your Daily Check-in</Text>
          <Text style={styles.cardText}>
            A moment of reflection is a step towards wellness. Let's start your day with intention.
          </Text>
        </Card>

        <View style={styles.featureGrid}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
