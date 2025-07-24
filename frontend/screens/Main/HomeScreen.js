import React from 'react';
import { Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/common/Card';
import FeatureCard from '../../components/specific/FeatureCard';
import AppHeader from '../../components/specific/AppHeader'; // Import the new header

const HomeScreen = () => {
  const navigation = useNavigation();
  const greeting = "Good Morning";
  const userName = "Riya";

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
        <Text style={styles.greeting}>{greeting}, {userName}</Text>
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
    marginTop: 20, // Add space below the new header
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
