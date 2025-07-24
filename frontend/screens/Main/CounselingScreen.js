import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import PsychologistCard from '../../components/specific/PsychologistCard'; // Import the new component

// MOCK DATA: In the future, this will come from your backend API
const MOCK_PSYCHOLOGISTS = [
  { 
    id: '1', 
    name: 'Dr. Anika Rahman', 
    specialization: 'Cognitive Behavioral Therapy', 
    rating: 4.8, 
    image: 'https://placehold.co/100x100/E0E0E0/333?text=Dr.+A' 
  },
  { 
    id: '2', 
    name: 'Dr. Fahim Ahmed', 
    specialization: 'Child Psychology', 
    rating: 4.9, 
    image: 'https://placehold.co/100x100/d4a373/333?text=Dr.+F' 
  },
  { 
    id: '3', 
    name: 'Dr. Sadia Islam', 
    specialization: 'Trauma and PTSD', 
    rating: 4.7, 
    image: 'https://placehold.co/100x100/a2d2ff/333?text=Dr.+S' 
  },
];

const CounselingScreen = () => {
  const handlePress = (psychologist) => {
    // We'll add booking logic here in a future step
    console.log('Selected Psychologist:', psychologist.name);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Find Your Counselor</Text>
      
      <FlatList
        data={MOCK_PSYCHOLOGISTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PsychologistCard 
            psychologist={item} 
            onPress={() => handlePress(item)} 
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default CounselingScreen;
