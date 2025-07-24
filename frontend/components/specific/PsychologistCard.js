import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PsychologistCard = ({ psychologist, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image 
        source={{ uri: psychologist.image }} 
        style={styles.image} 
        // Add a fallback in case the image fails to load
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/E0E0E0/333?text=Doc" }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{psychologist.name}</Text>
        <Text style={styles.specialization}>{psychologist.specialization}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingIcon}>⭐</Text>
          <Text style={styles.ratingText}>{psychologist.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
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
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40, // Makes it a circle
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  specialization: {
    fontSize: 14,
    color: '#475569',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
});

export default PsychologistCard;
