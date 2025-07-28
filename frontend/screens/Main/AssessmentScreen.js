import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AuthGuard from '../../components/specific/AuthGuard';
import { useTheme } from '../../store/ThemeContext'; // 1. Import useTheme

// MOCK DATA
const MOCK_QUIZZES = [
  {
    id: '1',
    title: 'Depression Screening (PHQ-9)',
    description: 'A 9-question tool to screen for depression.',
    questions: 9,
  },
  {
    id: '2',
    title: 'Anxiety Test (GAD-7)',
    description: 'A 7-question tool to screen for generalized anxiety disorder.',
    questions: 7,
  },
  {
    id: '3',
    title: 'Stress Level Assessment',
    description: 'Evaluate your current stress levels and identify triggers.',
    questions: 10,
  },
];

const AssessmentScreen = () => {
  const { theme } = useTheme(); // 2. Get the theme object

  const handlePress = (quiz) => {
    console.log('Selected Quiz:', quiz.title);
    alert('Quiz functionality is coming soon!');
  };

  // 3. Pass the theme to the styles function
  const themedStyles = styles(theme);

  return (
    <AuthGuard>
      {/* 4. Apply dynamic theme colors */}
      <View style={[themedStyles.container, { backgroundColor: theme.background }]}>
        <Text style={[themedStyles.header, { color: theme.primary }]}>Self-Assessment</Text>
        <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>Choose a quiz to understand your mental well-being.</Text>
        <FlatList
          data={MOCK_QUIZZES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[themedStyles.quizCard, { backgroundColor: theme.card }]} onPress={() => handlePress(item)}>
              <Text style={[themedStyles.quizTitle, { color: theme.primary }]}>{item.title}</Text>
              <Text style={[themedStyles.quizDescription, { color: theme.text }]}>{item.description}</Text>
              <Text style={[themedStyles.quizQuestions, { color: theme.secondaryText }]}>{item.questions} Questions</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 20,
  },
  subHeader: {
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quizCard: {
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizDescription: {
    fontSize: 14,
    marginVertical: 8,
    lineHeight: 20,
  },
  quizQuestions: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AssessmentScreen;
