import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TextInput, SafeAreaView } from 'react-native';
// --- CHANGE: useNavigation is no longer needed here ---
import PsychologistCard from '../../components/specific/PsychologistCard';
import AuthGuard from '../../components/specific/AuthGuard';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// UPDATED MOCK DATA
const MOCK_PSYCHOLOGISTS = [
  { 
    id: '1', 
    name: 'Dr. Mizanur Rahman', 
    specialization: 'Psychiatrist', 
    experience: 10,
    sessions: 150,
    details: 'MBBS, MS (Psychology), Dhaka Medical College',
    price: 2500,
    image: require('../../assets/images/dr-mizanur-rahman-Picsart-AiImageEnhancer.png') 
  },
  { 
    id: '2', 
    name: 'Dr. Md. Imran Hossain', 
    specialization: 'Child Psychology', 
    experience: 8,
    sessions: 200,
    details: 'MBBS, FCPS (Psychiatry), PG Hospital',
    price: 2000,
    image: 'https://placehold.co/100x100/d4a373/333?text=Dr.+F' 
  },
  { 
    id: '3', 
    name: 'Dr. Poly Bhoumik', 
    specialization: 'Child Psychologist', 
    experience: 12,
    sessions: 180,
    details: 'MBBS, MD (Psychiatry), National Institute of Mental Health',
    price: 3000,
    image: 'https://placehold.co/100x100/a2d2ff/333?text=Dr.+S' 
  },
];

const CounselingScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  // --- CHANGE: The navigation object and handlePress function are no longer needed here ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPsychologists, setFilteredPsychologists] = useState(MOCK_PSYCHOLOGISTS);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPsychologists(MOCK_PSYCHOLOGISTS);
    } else {
      const filtered = MOCK_PSYCHOLOGISTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPsychologists(filtered);
    }
  }, [searchQuery]);

  const themedStyles = styles(theme);
  const displayName = user ? user.name.split(' ')[0] : 'Guest';

  return (
    <AuthGuard>
      <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
        
        <View style={themedStyles.headerContainer}>
            <Text style={[themedStyles.header, { color: theme.text }]}>Hello {displayName}</Text>
            <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>How can we help you?</Text>
        </View>

        <View style={[themedStyles.searchContainer, { backgroundColor: theme.card }]}>
            <Ionicons name="search" size={20} color={theme.secondaryText} />
            <TextInput
                style={[themedStyles.searchInput, { color: theme.text }]}
                placeholder="Search a doctor or specialization"
                placeholderTextColor={theme.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>

        <Text style={[themedStyles.listTitle, { color: theme.text }]}>Live Doctors</Text>

        <FlatList
          data={filteredPsychologists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            // --- CHANGE: The onPress prop has been removed ---
            <PsychologistCard 
              psychologist={item} 
            />
          )}
          contentContainerStyle={themedStyles.listContent}
        />
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default CounselingScreen;
