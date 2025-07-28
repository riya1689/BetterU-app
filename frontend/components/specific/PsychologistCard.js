import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 1. Import useNavigation here
import { useTheme } from '../../store/ThemeContext';

// --- CHANGE: The component no longer accepts an 'onPress' prop ---
const PsychologistCard = ({ psychologist }) => {
  const { theme } = useTheme();
  const navigation = useNavigation(); // 2. Get the navigation object
  const themedStyles = styles(theme);

  // 3. Create a handlePress function inside this component
  const handlePress = () => {
    navigation.navigate('Appointment', { psychologist: psychologist });
  };

  return (
    <View style={[themedStyles.container, { backgroundColor: theme.card }]}>
      <Image 
        source={{ uri: psychologist.image }} 
        style={themedStyles.image} 
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/E0E0E0/333?text=Doc" }}
      />
      <View style={themedStyles.infoContainer}>
        <Text style={[themedStyles.name, { color: theme.text }]}>{psychologist.name}</Text>
        <Text style={[themedStyles.specialization, { color: theme.secondaryText }]}>{psychologist.specialization}</Text>
        
        <Text style={[themedStyles.experience, { color: theme.secondaryText }]}>
          {psychologist.experience} years • {psychologist.sessions} Sessions
        </Text>

        <Text style={[themedStyles.details, { color: theme.secondaryText }]}>{psychologist.details}</Text>
        
        <View style={themedStyles.bottomRow}>
          <View style={themedStyles.onlineStatus}>
            <View style={themedStyles.onlineDot} />
            <Text style={themedStyles.onlineText}>Online</Text>
          </View>
          
          <View style={themedStyles.bookingContainer}>
            {/* --- CHANGE: The button now calls its own handlePress function --- */}
            <TouchableOpacity 
              style={[themedStyles.bookButton, { backgroundColor: theme.primary }]}
              onPress={handlePress}
            >
              <Text style={themedStyles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
            <View style={[themedStyles.priceContainer, { backgroundColor: theme.border }]}>
              <Text style={[themedStyles.priceText, { color: theme.text }]}>{psychologist.price}৳</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  experience: {
    fontSize: 12,
    fontWeight: '500',
    marginVertical: 4,
  },
  details: {
    fontSize: 12,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e', // Green dot
    marginRight: 6,
  },
  onlineText: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  bookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  priceContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default PsychologistCard;