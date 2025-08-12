import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AIChatBanner = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const themedStyles = styles(theme);

  const handlePress = () => {
    navigation.navigate('AI Chat');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[themedStyles.container, { backgroundColor: theme.card }]}
    >
      <View style={themedStyles.textContainer}>
        <Text style={[themedStyles.title, { color: theme.text }]}>Talk to me</Text>
        <Text style={[themedStyles.subtitle, { color: theme.secondaryText }]}>I'm your AI Assistant</Text>
        
        {/* Decorative Fake Input */}
        <View style={[themedStyles.fakeInput, { backgroundColor: theme.background }]}>
            <Text style={{color: theme.secondaryText}}>Send a message...</Text>
            <Ionicons name="send" size={18} color={theme.primary} />
        </View>
      </View>
      
      <Image
        // IMPORTANT: Please replace this with the correct path to your robot image
        source={require('../../assets/images/BetterU_AI-removebg-preview.png')} // <-- Replace with your image path
        style={themedStyles.image}
      />
    </TouchableOpacity>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  fakeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    marginTop: 15,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 15,
  },
});

export default AIChatBanner;
