import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../store/ThemeContext';

const { width } = Dimensions.get('window');

const ExpertCard = ({ expert, onPress }) => {
  const { theme } = useTheme();
  const themedStyles = styles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={themedStyles.container}>
      {/* --- UPDATE: The 'source' prop is now simpler to accept local images --- */}
      <Image 
        source={expert.image} 
        style={themedStyles.image} 
      />
      <View style={themedStyles.infoOverlay}>
        <Text style={themedStyles.name}>{expert.name}</Text>
        <Text style={themedStyles.specialization}>{expert.specialization}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    width: width * 0.4,
    height: width * 0.5,
    borderRadius: 15,
    marginRight: 15,
    overflow: 'visible',// Allow shadow to be visible
    backgroundColor: theme.card, // Add a background for the shadow to appear
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15, // Match container's border radius
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
    borderBottomLeftRadius: 15,//change
    borderBottomRightRadius: 15,//change
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialization: {
    color: 'white',
    fontSize: 12,
  },
});

export default ExpertCard;
