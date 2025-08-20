import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { signup } = useAuth();
  const { theme } = useTheme();

  const handleUserSignup = () => {
    if (password !== confirmPassword) {
      console.warn("Passwords do not match!");
      return;
    }
    const fullName = `${firstName} ${lastName}`;
    signup(fullName, email, password, 'user', navigation);
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/BetterU-signup1-removebg-preview.png')}
              style={styles.headerImage}
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>to get started now!</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor={theme.secondaryText}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor={theme.secondaryText}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={theme.secondaryText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.secondaryText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={theme.secondaryText} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={theme.secondaryText}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                <Ionicons name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={theme.secondaryText} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleUserSignup}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>or sign up as</Text>
            <View style={styles.line} />
          </View>

          {/* --- UPDATED: Admin icon is removed, container is centered --- */}
          <View style={styles.roleLoginContainer}>
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => navigation.navigate('DoctorSignup')}
            >
              <FontAwesome5 name="user-md" size={28} color={theme.primary} />
              <Text style={styles.roleText}>Doctor</Text>
            </TouchableOpacity>
          </View>

          {/* --- UPDATED: Login container style is adjusted --- */}
          <TouchableOpacity style={styles.loginContainer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20, // Reduced vertical padding
    },
    header: {
        alignItems: 'center',
        marginBottom: 25, // Reduced margin
    },
    headerImage: {
        width: 140, // Slightly smaller image
        height: 140,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.text,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: theme.secondaryText,
        marginTop: 8,
    },
    formContainer: {
        width: '100%',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    nameInput: {
        width: '48%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.card,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.border,
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontSize: 16,
        color: theme.text,
    },
    eyeIcon: {
        padding: 15,
    },
    signupButton: {
        backgroundColor: theme.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25, // Adjusted margin
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.border,
    },
    separatorText: {
        marginHorizontal: 15,
        color: theme.secondaryText,
        fontSize: 14,
    },
    roleLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // This centers the single icon
        alignItems: 'center',
    },
    roleButton: {
        alignItems: 'center',
        padding: 10,
    },
    roleText: {
        color: theme.text,
        fontSize: 14,
        fontWeight: '500',
        marginTop: 8,
    },
    loginContainer: {
        marginTop: 20, // Reduced margin to move it up
        alignItems: 'center',
        marginBottom:20,
    },
    loginText: {
        color: theme.secondaryText,
        fontSize: 16,
    },
    loginLink: {
        color: theme.primary,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
