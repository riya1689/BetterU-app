import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { signup } = useAuth();

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const fullName = `${firstName} ${lastName}`;
    // --- CHANGE: Pass the navigation object to the signup function ---
    signup(fullName, email, password, navigation);
  };

  return (
    <LinearGradient
      colors={['#c3aed6', '#e2d4f0']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>to get started now!</Text>

          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="First Name"
              placeholderTextColor="#6c5b7b"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Last Name"
              placeholderTextColor="#6c5b7b"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#6c5b7b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#6c5b7b"
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
                color="#3a3242" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#6c5b7b"
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
                color="#3a3242" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
             <View style={styles.dividerLine} />
             <Text style={styles.dividerText}>Or Sign Up with</Text>
             <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
              <Ionicons name="logo-google" size={24} color="#3a3242" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={{ fontWeight: 'bold' }}>Login Now</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#3a3242', marginBottom: 5 },
  subtitle: { fontSize: 24, color: '#4a4252', marginBottom: 40 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.5)', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10, fontSize: 16, color: '#3a3242', marginBottom: 15 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between' },
  nameInput: { width: '48%' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 10, marginBottom: 15 },
  passwordInput: { flex: 1, paddingHorizontal: 20, paddingVertical: 15, fontSize: 16, color: '#3a3242' },
  eyeIcon: { padding: 15 },
  signupButton: { backgroundColor: '#ffffff', paddingVertical: 18, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  signupButtonText: { color: '#3a3242', fontSize: 18, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#a39da9' },
  dividerText: { marginHorizontal: 10, color: '#4a4252' },
  googleButton: { backgroundColor: '#ffffff', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  loginText: { textAlign: 'center', color: '#3a3242', fontSize: 16 },
});

export default SignupScreen;
