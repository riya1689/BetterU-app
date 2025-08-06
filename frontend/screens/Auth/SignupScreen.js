import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext'; // Import useTheme

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { signup } = useAuth();
  const { theme } = useTheme(); // Get the theme object

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const fullName = `${firstName} ${lastName}`;
    signup(fullName, email, password, navigation);
  };
  
  // Create a dynamic stylesheet that uses the theme
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      
      <View style={styles.content}>
        {/* --- CHANGE: Added the header image --- */}
        <Image
          source={require('../../assets/images/BetterU-signup1-removebg-preview.png')}
          style={styles.headerImage}
        />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>to get started now!</Text>

        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="First Name"
            placeholderTextColor={theme.secondaryText}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Last Name"
            placeholderTextColor={theme.secondaryText}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={theme.secondaryText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor={theme.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={24} 
              color={theme.text} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor={theme.secondaryText}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity 
            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={24} 
              color={theme.text} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={{ fontWeight: 'bold' }}>Login Now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- CHANGE: Styles are now a function that accepts the theme ---
const getStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: theme.background, // Use theme background color
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 30 
  },
  // --- NEW STYLE for the header image ---
  headerImage: {
    width: 250,
    height: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: { 
    fontSize: 32, // Adjusted font size
    fontWeight: 'bold', 
    color: theme.text, // Use theme text color
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 18, 
    color: theme.secondaryText, // Use theme secondary text color
    textAlign: 'center',
    marginBottom: 30,
  },
  input: { 
    backgroundColor: theme.card, // Use theme card color
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    borderRadius: 10, 
    fontSize: 16, 
    color: theme.text, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  nameRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  nameInput: { 
    width: '48%' 
  },
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.card, 
    borderRadius: 10, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  passwordInput: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    fontSize: 16, 
    color: theme.text 
  },
  eyeIcon: { 
    padding: 15 
  },
  signupButton: { 
    backgroundColor: theme.primary, // Use theme primary color
    paddingVertical: 18, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 20 
  },
  signupButtonText: { 
    color: theme.card, // Use theme card color for text
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  loginText: { 
    textAlign: 'center', 
    color: theme.secondaryText, 
    fontSize: 16 
  },
});

export default SignupScreen;