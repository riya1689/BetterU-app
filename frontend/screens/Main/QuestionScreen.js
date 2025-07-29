import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// For now, we use a single mock question to build the UI.
// We will make this dynamic in the next steps.
const MOCK_QUESTION = {
  id: '1',
  text: 'Where are you feeling your stress most?',
  options: ['In my mind', 'In my chest', 'In my stomach', 'Everywhere', 'Not sure'],
};

const QuestionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);
  const themedStyles = styles(theme);

  const handleNext = () => {
    // In the next steps, this will navigate to the next question or the home screen.
    // For now, it will just log the selected answer.
    if (selectedOption) {
      console.log('Selected:', selectedOption);
      alert(`You selected: ${selectedOption}`);
    } else {
      alert('Please select an option.');
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/BetterU_question_bg.jpg')} 
      style={themedStyles.container}
    >
      <SafeAreaView style={themedStyles.safeArea}>
        <StatusBar barStyle="dark-content" />
        
        <View style={themedStyles.content}>
          <Text style={themedStyles.headerText}>Take Your Time!</Text>
          <Text style={themedStyles.questionText}>{MOCK_QUESTION.text}</Text>

          <View style={themedStyles.optionsContainer}>
            {MOCK_QUESTION.options.map((option) => (
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay for readability
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
