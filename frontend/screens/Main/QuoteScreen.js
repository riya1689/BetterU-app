import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Import your images here
import hidingLady from '../../assets/images/BetterU_hide_laday_standing-removebg-preview.png';
import hidingGirlFace from '../../assets/images/BetterU_hiding_face_girl-removebg-preview.png';
import hidingCrying from '../../assets/images/BetterU_mental_hide_crying-removebg-preview.png';
import hidingBoySitting from '../../assets/images/BetterU-hiding-boy-sitting-removebg-preview.png';
import hidingGirlSitting from '../../assets/images/BetterU-hiding-girl-sitting-removebg-preview.png';
import understandingImage from '../../assets/images/BeetterU-understandiing-removebg-preview.png';

const { width } = Dimensions.get('window');

const QuoteScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const themedStyles = styles(theme);

  const handleNext = () => {
    navigation.replace('MainTabs');
  };

  // Helper component to render each floating image with its container
  const renderFloatingImage = (source, styleOverrides) => (
    <View style={[themedStyles.floatingImageContainer, styleOverrides]}>
      <Image source={source} style={themedStyles.floatingImage} resizeMode="contain" />
    </View>
  );

  return (
    <SafeAreaView style={[themedStyles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={themedStyles.content}>
        <View style={themedStyles.quoteArea}>
          {/* This container holds the first line of text and its 5 surrounding images */}
          <View style={themedStyles.hidingImagesWrapper}>
            {/* 1. Above Center */}
            {renderFloatingImage(hidingGirlFace, {
              top: -110,
              left: '50%',
              transform: [{ translateX: -47.5 }],
              width: 95,
              height: 95,
            })}

            {/* 2. Left Side */}
            {renderFloatingImage(hidingLady, {
              top: '50%',
              left: -55,
              transform: [{ translateY: -42.5 }],
              width: 85,
              height: 85,
            })}

            {/* 3. Right Side */}
            {renderFloatingImage(hidingGirlSitting, {
              top: '50%',
              right: -55,
              transform: [{ translateY: -45 }],
              width: 90,
              height: 90,
            })}

            {/* 4. Under, Little Bit Left */}
            {renderFloatingImage(hidingCrying, {
              bottom: -100,
              left: '20%',
              width: 80,
              height: 80,
            })}

            {/* 5. Under, Little Bit Right */}
            {renderFloatingImage(hidingBoySitting, {
              bottom: -100,
              right: '20%',
              width: 80,
              height: 80,
            })}

            <Text style={themedStyles.quoteText}>
              Mental health isn’t about hiding emotions —
            </Text>
          </View>

          <Text style={themedStyles.quoteText}>
            It’s about understanding them.
          </Text>

          {/* 6. Understanding Image with new container and position */}
          <View style={themedStyles.understandingImageContainer}>
             <Image source={understandingImage} style={themedStyles.understandingImage} resizeMode="contain" />
          </View>

        </View>
      </View>

      <View style={themedStyles.footer}>
        <TouchableOpacity style={themedStyles.nextButton} onPress={handleNext}>
          <Text style={themedStyles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward-circle" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quoteArea: {
    alignItems: 'center',
    width: '100%',
  },
  quoteText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
    textAlign: 'center',
    lineHeight: 40,
    zIndex: 10,
    marginBottom: 20, // Added margin for spacing
  },
  hidingImagesWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
    marginBottom: 100,
    width: '75%',
  },
  floatingImageContainer: {
    position: 'absolute',
    backgroundColor: theme.card,
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5, },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingImage: {
    width: '100%',
    height: '100%',
  },
  // New style for the rectangular container
  understandingImageContainer: {
    marginTop: 10, // Space above the container
    width: 200,     // Made larger
    height: 90,      // Made larger
    backgroundColor: theme.card,
    borderRadius: 15, // Rounded corners for the rectangle
    padding: 10,
    // Consistent shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5, },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Image style to fit inside the new container
  understandingImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 30,
    alignItems: 'flex-end',
    width: '100%',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default QuoteScreen;