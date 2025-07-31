import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../store/ThemeContext';

const FeatureCard = ({ imageSource, title, onPress }) => {
  const { theme } = useTheme();
  const themedStyles = styles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={themedStyles.container}>
      {/* The main card now has no padding */}
      <View style={[themedStyles.card, { backgroundColor: theme.card }]}>
        {/* The image now takes up the top portion of the card */}
        <Image source={imageSource} style={themedStyles.image} />
        
        {/* This is the new colored banner for the text */}
        <View style={[themedStyles.textContainer, { backgroundColor: theme.primary }]}>
          <Text style={themedStyles.title}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 15,
  },
  card: {
    borderRadius: 15,
    // Remove padding to allow the image to fill the corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden', // This is important to keep the image within the rounded corners
  },
  image: {
    width: '100%',
    height: 120, // Give the image a fixed height
    resizeMode: 'cover', // 'cover' will fill the space nicely
  },
  // New styles for the text banner
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // Text is now white to be visible on the colored background
  },
});

export default FeatureCard;
