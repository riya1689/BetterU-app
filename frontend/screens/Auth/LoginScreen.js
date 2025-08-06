import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext'; // Import useTheme

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme(); // Get the theme object

  const handleLogin = () => {
    login(email, password, navigation);
  };

  // Create a dynamic stylesheet that uses the theme
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      
      <View style={styles.content}>
        {/* --- ADDED: Header Image --- */}
        <Image
          source={require('../../assets/images/BetterU-login-removebg-preview.png')}
          style={styles.headerImage}
        />

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Glad to see you again!</Text>

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
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up Now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- UPDATED: Styles are now a function that uses the theme ---
const getStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: theme.background,
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 30 
  },
  headerImage: {
    width: 280,
    height: 220,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: theme.text, 
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 18, 
    color: theme.secondaryText, 
    textAlign: 'center',
    marginBottom: 40,
  },
  input: { 
    backgroundColor: theme.card,
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    borderRadius: 10, 
    fontSize: 16, 
    color: theme.text, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.border,
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
  forgotPassword: { 
    textAlign: 'right', 
    color: theme.primary, 
    marginBottom: 20,
    fontWeight: '600',
  },
  loginButton: { 
    backgroundColor: theme.primary, 
    paddingVertical: 18, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  loginButtonText: { 
    color: theme.card, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  signupText: { 
    textAlign: 'center', 
    color: theme.secondaryText, 
    fontSize: 16 
  },
});

export default LoginScreen;
