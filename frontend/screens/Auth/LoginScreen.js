import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext'; // We'll use this later

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Get the login function from our context

  const handleLogin = () => {
    // For now, this just calls our mock login function
    login(email, password);
  };

  return (
    <LinearGradient
      colors={['#c3aed6', '#e2d4f0']} // Your beautiful purple gradient
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <Text style={styles.title}>Welcome,</Text>
          <Text style={styles.subtitle}>Glad to see you!</Text>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#6c5b7b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6c5b7b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
             <View style={styles.dividerLine} />
             <Text style={styles.dividerText}>Or Login with</Text>
             <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
              <Text>G</Text> {/* Replace with Google icon later */}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>
              Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up Now</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3a3242',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    color: '#4a4252',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#3a3242',
    marginBottom: 15,
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#3a3242',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#3a3242',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#a39da9'
  },
  dividerText: {
      marginHorizontal: 10,
      color: '#4a4252'
  },
  googleButton: {
      backgroundColor: '#ffffff',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 30,
  },
  signupText: {
    textAlign: 'center',
    color: '#3a3242',
    fontSize: 16,
  },
});

export default LoginScreen;
