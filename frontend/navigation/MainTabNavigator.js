import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import your screens
import HomeScreen from '../screens/Main/HomeScreen';
import CounselingScreen from '../screens/Main/CounselingScreen';
import AIChatScreen from '../screens/Main/AIChatScreen';
import MeditationScreen from '../screens/Main/MeditationScreen';
import AssessmentScreen from '../screens/Main/AssessmentScreen'; // Import AssessmentScreen
import ProfileScreen from '../screens/Main/ProfileScreen';


const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide the default header for all screens
        tabBarActiveTintColor: '#1e3a8a',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<Text style={{color: color, fontSize: size}}>🏠</Text>),
        }}
      />
      <Tab.Screen 
        name="Counseling" 
        component={CounselingScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<Text style={{color: color, fontSize: size}}>📅</Text>),
        }}
      />
      <Tab.Screen 
        name="AI Chat" 
        component={AIChatScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<Text style={{color: color, fontSize: size}}>🤖</Text>),
        }}
      />
      <Tab.Screen 
        name="Meditate" 
        component={MeditationScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<Text style={{color: color, fontSize: size}}>🧘</Text>),
        }}
      />
      {/* --- NEW ASSESSMENT TAB --- */}
      <Tab.Screen 
        name="Assess" 
        component={AssessmentScreen} 
        options={{
          tabBarLabel: 'Assess', // Set the tab label
          tabBarIcon: ({ color, size }) => (<Text style={{color: color, fontSize: size}}>📝</Text>),
        }}
      />
       <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<Text style={{color: color, fontSize: size}}>👤</Text>),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
