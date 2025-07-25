import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import AuthGuard from '../../components/specific/AuthGuard';

// MOCK DATA: This will come from your backend later
const MOCK_TRACKS = [
  { id: '1', title: 'Morning Calm', category: 'Mindfulness', image: 'https://placehold.co/300x300/a2d2ff/333?text=Morning+Calm' },
  { id: '2', title: 'Deep Sleep', category: 'Sleep', image: 'https://placehold.co/300x300/bde0fe/333?text=Deep+Sleep' },
  { id: '3', title: 'Stress Relief', category: 'Anxiety', image: 'https://placehold.co/300x300/ffafcc/333?text=Stress+Relief' },
  { id: '4', title: 'Focus Boost', category: 'Productivity', image: 'https://placehold.co/300x300/ffc8dd/333?text=Focus+Boost' },
  { id: '5', title: 'Walking Meditation', category: 'Mindfulness', image: 'https://placehold.co/300x300/cdb4db/333?text=Walking' },
  { id: '6', title: 'Peaceful Guitar', category: 'Relaxation', image: 'https://placehold.co/300x300/bfa2db/333?text=Peaceful' },
];

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30; // Calculate width for two cards with margin

const MeditationScreen = () => {
  const handlePress = (track) => {
    // We will build the music player in a later step
    console.log('Selected Track:', track.title);
  };

  return (
    <AuthGuard>
    <View style={styles.container}>
      <Text style={styles.header}>Meditation Library</Text>
      <FlatList
        data={MOCK_TRACKS}
        keyExtractor={(item) => item.id}
        numColumns={2} // This creates the grid layout
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.cardContainer}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
    </AuthGuard>
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
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: cardWidth, // Make the image square
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e3a8a',
    marginTop: 10,
    marginHorizontal: 10,
  },
  cardCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 10,
    marginBottom: 10,
  },
});

export default MeditationScreen;
