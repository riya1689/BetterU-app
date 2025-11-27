import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width * 0.25;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

// Mood Data with Scores and Colors
const MOODS = [
  { key: 'left-spacer' },
  { id: '1', emoji: '😡', name: 'Angry', color: '#FF6B6B', score: 1, message: "Take a deep breath. It's okay to feel this way." },
  { id: '2', emoji: '😔', name: 'Sad', color: '#4ECDC4', score: 2, message: "You are not alone. Be gentle with yourself." },
  { id: '3', emoji: '😐', name: 'Neutral', color: '#FFE66D', score: 3, message: "A balanced state is a good place to be." },
  { id: '4', emoji: '🙂', name: 'Good', color: '#1A535C', score: 4, message: "Glad to hear you're doing well!" },
  { id: '5', emoji: '🤩', name: 'Amazing', color: '#FF9F1C', score: 5, message: "That's fantastic! Hold onto this feeling." },
  { key: 'right-spacer' },
];

const MoodTrackerScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const themedStyles = styles(theme);

  const [selectedMood, setSelectedMood] = useState(MOODS[3]); // Default to Neutral/Good

  // Handle Scroll to Select
  const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // Find the item closest to the center
      const centerItem = viewableItems[0].item;
      if (centerItem.id) {
        setSelectedMood(centerItem);
      }
    }
  }).current;

  const handleSaveMood = async () => {
    try {
      let token = user?.token;
      if (!token) token = await AsyncStorage.getItem('userToken');

      const response = await fetch('http://10.0.2.2:5000/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: selectedMood.name,
          score: selectedMood.score,
          // Time of day is handled by backend logic (or you can add logic here)
        })
      });

      if (response.ok) {
        Alert.alert("Success", "Mood saved successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to save mood");
      }
    } catch (error) {
      console.log("Save Mood Error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const renderItem = ({ item }) => {
    if (!item.id) {
      return <View style={{ width: SPACER_ITEM_SIZE }} />;
    }

    const isSelected = selectedMood.id === item.id;

    return (
      <TouchableOpacity 
        style={[themedStyles.moodItem, { width: ITEM_SIZE }]}
        onPress={() => setSelectedMood(item)}
      >
        <View style={[
          themedStyles.emojiContainer, 
          isSelected && { 
            transform: [{ scale: 1.5 }], 
            backgroundColor: item.color + '20', // Light opacity background
            borderColor: item.color,
            borderWidth: 2
          }
        ]}>
          <Text style={themedStyles.emoji}>{item.emoji}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[themedStyles.headerTitle, { color: theme.primary }]}>Wellness Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={themedStyles.content}>
        <Text style={[themedStyles.question, { color: theme.text }]}>How would you describe your mood?</Text>

        {/* Slider */}
        <View style={themedStyles.sliderContainer}>
          <FlatList
            data={MOODS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id || item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_SIZE}
            decelerationRate={0}
            bounces={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            scrollEventThrottle={16}
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </View>

        {/* Selected Mood Info */}
        <View style={themedStyles.infoContainer}>
            <Text style={[themedStyles.moodName, { color: selectedMood.color || theme.text }]}>
                {selectedMood.name}
            </Text>
            
            <View style={[themedStyles.messageBox, { backgroundColor: (selectedMood.color || theme.primary) + '20' }]}>
                <Text style={[themedStyles.messageText, { color: theme.text }]}>
                    {selectedMood.message}
                </Text>
                <Ionicons name="heart" size={16} color={selectedMood.color || theme.primary} style={{marginTop: 5}}/>
            </View>
        </View>

        <TouchableOpacity 
            style={[themedStyles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSaveMood}
        >
            <Text style={themedStyles.saveButtonText}>Save Mood</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly' },
  question: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 40 },
  sliderContainer: { height: 150, marginTop: 20 },
  moodItem: { alignItems: 'center', justifyContent: 'center' },
  emojiContainer: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emoji: { fontSize: 40 },
  infoContainer: { alignItems: 'center', width: '80%' },
  moodName: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  messageBox: {
    padding: 15, borderRadius: 15,
    alignItems: 'center', width: '100%',
  },
  messageText: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
  saveButton: {
    paddingVertical: 15, paddingHorizontal: 60,
    borderRadius: 30, elevation: 5,
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default MoodTrackerScreen;