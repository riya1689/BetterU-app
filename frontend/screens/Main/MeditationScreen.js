import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import AuthGuard from '../../components/specific/AuthGuard';
import { useTheme } from '../../store/ThemeContext'; // 1. Import useTheme

// MOCK DATA
const MOCK_TRACKS = [
  { id: '1', title: 'Morning Calm', category: 'Mindfulness', image: 'https://placehold.co/300x300/a2d2ff/333?text=Morning+Calm' },
  { id: '2', title: 'Deep Sleep', category: 'Sleep', image: 'https://placehold.co/300x300/bde0fe/333?text=Deep+Sleep' },
  { id: '3', title: 'Stress Relief', category: 'Anxiety', image: 'https://placehold.co/300x300/ffafcc/333?text=Stress+Relief' },
  { id: '4', title: 'Focus Boost', category: 'Productivity', image: 'https://placehold.co/300x300/ffc8dd/333?text=Focus+Boost' },
  { id: '5', title: 'Walking Meditation', category: 'Mindfulness', image: 'https://placehold.co/300x300/cdb4db/333?text=Walking' },
  { id: '6', title: 'Peaceful Guitar', category: 'Relaxation', image: 'https://placehold.co/300x300/bfa2db/333?text=Peaceful' },
];

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30;

const MeditationScreen = () => {
  const { theme } = useTheme(); // 2. Get the theme object

  const handlePress = (track) => {
    console.log('Selected Track:', track.title);
  };

  // 3. Pass the theme to the styles function
  const themedStyles = styles(theme);

  return (
    <AuthGuard>
      {/* 4. Apply dynamic theme colors */}
      <View style={[themedStyles.container, { backgroundColor: theme.background }]}>
        <Text style={[themedStyles.header, { color: theme.primary }]}>Meditation Library</Text>
        <FlatList
          data={MOCK_TRACKS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={[themedStyles.cardContainer, { backgroundColor: theme.card }]}>
              <Image source={{ uri: item.image }} style={themedStyles.cardImage} />
              <Text style={[themedStyles.cardTitle, { color: theme.primary }]}>{item.title}</Text>
              <Text style={[themedStyles.cardCategory, { color: theme.secondaryText }]}>{item.category}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={themedStyles.listContent}
        />
      </View>
    </AuthGuard>
  );
};

// --- 5. IMPORTANT CHANGE: Convert styles to a function ---
const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: cardWidth,
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
    height: cardWidth,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginHorizontal: 10,
  },
  cardCategory: {
    fontSize: 14,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});

export default MeditationScreen;
