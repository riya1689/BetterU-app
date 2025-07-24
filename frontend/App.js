import 'react-native-gesture-handler'; // Should be at the top

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './navigation/MainTabNavigator';



export default function App() {

return (

 <NavigationContainer>

 <MainTabNavigator />

 </NavigationContainer>

 );

}