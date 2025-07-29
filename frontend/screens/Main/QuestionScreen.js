import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// --- 1. Add the full list of questions ---
const ALL_QUESTIONS = [
  { id: '1', text: 'Where are you feeling your stress most?', options: ['In my mind', 'In my chest', 'In my stomach', 'Everywhere', 'Not sure'] },
  { id: '2', text: "What's your goal for today?", options: ['Just make it through', 'Be kind to myself', 'Focus on healing', 'Try something new', 'Find some peace'] },
  { id: '3', text: 'When did you last feel truly okay?', options: ['Today', 'This week', 'A few weeks ago', 'Can’t remember', 'I’m not sure'] },
  { id: '4', text: 'How are you sleeping lately?', options: ['Sleeping well', 'Trouble falling asleep', 'Waking up often', 'Not sleeping at all', 'Not sure'] },
  { id: '5', text: 'What do you need most right now?', options: ['Someone to understand', 'A moment to breathe', 'A gentle push forward', 'Emotional release', 'Distraction or lightness'] },
  { id: '6', text: 'What’s one word that captures your mood?', options: ['Peaceful', 'Restless', 'Lonely', 'Hopeful', 'Confused'] },
  { id: '7', text: 'How’s your heart feeling right now?', options: ['Light and happy', 'Heavy and tired', 'A bit anxious', 'Numb or quiet', 'Unsure'] },
];

// Helper function to get two random, unique questions
const getRandomQuestions = () => {
  const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

const QuestionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const themedStyles = styles(theme);

  // --- 2. Select two random questions when the screen loads ---
  useEffect(() => {
    setQuestions(getRandomQuestions());
  }, []);

  // --- 3. Update the handleNext function with the new logic ---
  const handleNext = () => {
    if (!selectedOption) {
      alert('Please select an option.');
      return;
    }

    // If there is another question, go to the next one.
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selection for the new question
    } else {
      // If this was the last question, navigate to the main app.
      navigation.replace('MainTabs');
    }
  };

  // If questions are not loaded yet, show a loading state
  if (questions.length === 0) {
    return <View style={[themedStyles.container, { backgroundColor: 'white' }]} />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ImageBackground 
      source={require('../../assets/images/BetterU_question_bg.jpg')} 
      style={themedStyles.container}
    >
      <SafeAreaView style={themedStyles.safeArea}>
        <StatusBar barStyle="dark-content" />
        
        <View style={themedStyles.content}>
          <Text style={themedStyles.headerText}>Take Your Time!</Text>
          <Text style={themedStyles.questionText}>{currentQuestion.text}</Text>

          <View style={themedStyles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity 
                key={option}
                style={[
                  themedStyles.optionButton,
                  selectedOption === option ? { backgroundColor: theme.primary, borderColor: theme.primary } : {}
                ]}
                onPress={() => setSelectedOption(option)}
              >
                <View style={[
                  themedStyles.radioCircle,
                  selectedOption === option ? { borderColor: 'white' } : { borderColor: theme.secondaryText }
                ]}>
                  {selectedOption === option && <View style={themedStyles.radioDot} />}
                </View>
                <Text style={[
                  themedStyles.optionText,
                  selectedOption === option ? { color: 'white' } : { color: theme.text }
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={themedStyles.footer}>
          <TouchableOpacity style={themedStyles.nextButton} onPress={handleNext}>
            <Text style={themedStyles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward-circle" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  questionText: {
    fontSize: 20,
    color: theme.text,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    padding: 30,
    alignItems: 'flex-end',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  nextButtonText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default QuestionScreen;
