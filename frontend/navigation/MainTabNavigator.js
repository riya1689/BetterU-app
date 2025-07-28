import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // 1. Import the icon library

// Import your screens
import HomeScreen from '../screens/Main/HomeScreen';
import CounselingScreen from '../screens/Main/CounselingScreen';
import AIChatScreen from '../screens/Main/AIChatScreen';
import MeditationScreen from '../screens/Main/MeditationScreen';
import AssessmentScreen from '../screens/Main/AssessmentScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a', // The active color for icons and text
        tabBarInactiveTintColor: 'gray',   // The inactive color
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // --- 2. Assign a specific icon to each tab ---
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Counseling') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'AI Chat') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Meditate') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Assess') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Counseling" component={CounselingScreen} />
      <Tab.Screen name="AI Chat" component={AIChatScreen} />
      <Tab.Screen name="Meditate" component={MeditationScreen} />
      <Tab.Screen name="Assess" component={AssessmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
