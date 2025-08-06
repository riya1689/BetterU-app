// import React from 'react';
// import { TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const HomeButton = () => {
//   const navigation = useNavigation();

//   const goToWelcomeScreen = () => {
//     // Simply navigate to the 'Welcome' screen.
//     navigation.navigate('Welcome');
//   };

//   return (
//     <TouchableOpacity style={styles.button} onPress={goToWelcomeScreen}>
//       <Ionicons name="home-outline" size={24} color="#3a3242" />
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     position: 'absolute',
//     top: 60,
//     right: 20,
//     backgroundColor: '#ffffff',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// });

// export default HomeButton;