import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import apiClient from '../../services/apiClient';
import { Ionicons } from '@expo/vector-icons';

const OtpVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params; // Get the email passed from the signup screen
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (/^\d*$/.test(text)) { // Allow only digits
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to the next input if a digit is entered
      if (text && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to the previous input on backspace if the current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
  
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp: otpCode });
      Alert.alert('Success!', response.data.message);
      navigation.replace('Login'); // Navigate to Login screen on success
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <View style={styles.content}>
        <Ionicons name="mail-unread-outline" size={80} color={theme.primary} />
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>We've sent a 6-digit verification code to <Text style={{fontWeight: 'bold'}}>{email}</Text></Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => inputs.current[index] = el}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              value={digit}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp} disabled={loading}>
          <Text style={styles.verifyButtonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 30,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: theme.secondaryText,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 55,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    backgroundColor: theme.card,
  },
  verifyButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OtpVerificationScreen;
