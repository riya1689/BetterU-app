import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import FeatureCard from '../../components/specific/FeatureCard';
import AppHeader from '../../components/specific/AppHeader';
import ExpertCard from '../../components/specific/ExpertCard';
import AIChatBanner from '../../components/specific/AIChatBanner'; // 1. Import the new banner
import MoodTrackerBanner from '../../components/specific/MoodTrackerBanner';
// --- UPDATE: Using a local image for the first expert ---
const MOCK_EXPERTS = [
    { 
      id: '1', 
      name: 'Dr. Mizanur Rahman', 
      specialization: 'Psychiatrist', 
      // This now uses require() to load the local image
      image: require('../../assets/images/dr-mizanur-rahman-Picsart-AiImageEnhancer.png') 
    },
    { id: '2', name: 'Dr. Md. Imran Hossain', specialization: 'Clinical Psychologist',
      image: require('../../assets/images/dr-md-imran-hossain.png') },
    { id: '3', name: 'Dr. Poly Bhoumik', specialization: 'Child Psychologist', 
      image: require('../../assets/images/dr-poly-bhoumik.png') },
    { id: '4', name: 'Dr. Nusrhat Jahan Sarker', specialization: 'Psychotherapist', 
      image: require('../../assets/images/dr-nushrat-jahan-sarker-Picsart-AiImageEnhancer.png') }
];
// ---------------------------------------------------------

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
  const { theme } = useTheme();

  const greeting = getGreeting();
  const displayName = user ? user.name.split(' ')[0] : 'There';

  // --- NOTIFICATION LOGIC ---
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      let token = user?.token;
      if (!token) token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch('http://10.0.2.2:5000/api/notifications/unread-count', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setUnreadCount(data.count);
    } catch (error) {
      console.log("Home Notification Error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

 //-------------
  const handlePress = (screenName) => {
    if (screenName) {
      navigation.navigate(screenName);
    } else {
      console.log('Feature coming soon!');
    }
  };

  const handleExpertPress = (expert) => {
      console.log('Selected expert:', expert.name);
  }

  const themedStyles = styles(theme);

  return (
    <SafeAreaView style={[themedStyles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader unreadCount={unreadCount} onNotificationPress={() => navigation.navigate('Notifications')} />
      
      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        <Text style={[themedStyles.greeting, { color: theme.primary }]}>{greeting}, {displayName}</Text>
        <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>How are you feeling today?</Text>

      <MoodTrackerBanner />

        
        <View style={themedStyles.sliderSection}>
            <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Available Experts for you</Text>
            <FlatList
                data={MOCK_EXPERTS}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ExpertCard 
                        expert={item}
                        onPress={() => handleExpertPress(item)}
                    />
                )}
                contentContainerStyle={{ paddingLeft: 20 }}
            />
        </View>
         {/* --- 2. Add the new AI Chat Banner here --- */}
        <AIChatBanner />
        {/* --- UPDATED FEATURE CARD SECTION --- */}
        <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>BetterU Care Toolkit</Text>
        <View style={themedStyles.featureGrid}>


          <FeatureCard 
            imageSource={require('../../assets/images/BetterU-mood-tracker.png')} 
            title="Mood Tracker" 
            onPress={() => handlePress('MoodTracker')} 
          />

          <FeatureCard 
            imageSource={require('../../assets/images/BetterU_booking_session-removebg-preview.png')}
            title="Book a Session" 
            onPress={() => handlePress('Counseling')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU_AI_chat-removebg-preview.png')}
            title="AI Assistant" 
            onPress={() => handlePress('AI Chat')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU-meditation-boy-girl.png')}
            title="Meditation" 
            onPress={() => handlePress('Meditate')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU_self_Assesment.png')}
            title="Self-Assess" 
            onPress={() => handlePress('Assess')}
          />
          {/* ----------- Join as Doctor ------------- */}

          <FeatureCard 
            imageSource={require('../../assets/images/HiringDoctor.jpg')} // Placeholder image
            title="Join as Doctor" 
            onPress={() => handlePress('JobBoard')} 
          />
        </View>
        {/* ------------------------------------ */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {},
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sliderSection: {
      marginBottom: 30,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      paddingHorizontal: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
