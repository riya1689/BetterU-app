import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AuthGuard from '../../components/specific/AuthGuard';

// MOCK DATA: This will come from your backend later
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
  const handlePress = (quiz) => {
    // We will build the quiz-taking interface later
    console.log('Selected Quiz:', quiz.title);
    alert('Quiz functionality is coming soon!');
  };

  return (
    <AuthGuard>
    <View style={styles.container}>
      <Text style={styles.header}>Self-Assessment</Text>
      <Text style={styles.subHeader}>Choose a quiz to understand your mental well-being.</Text>
      <FlatList
        data={MOCK_QUIZZES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.quizCard} onPress={() => handlePress(item)}>
            <Text style={styles.quizTitle}>{item.title}</Text>
            <Text style={styles.quizDescription}>{item.description}</Text>
            <Text style={styles.quizQuestions}>{item.questions} Questions</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 20,
  },
  subHeader: {
    fontSize: 16,
    color: '#475569',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quizCard: {
    backgroundColor: 'white',
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
    color: '#1e3a8a',
  },
  quizDescription: {
    fontSize: 14,
    color: '#334155',
    marginVertical: 8,
    lineHeight: 20,
  },
  quizQuestions: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
});

export default AssessmentScreen;
