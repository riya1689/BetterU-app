import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();

  // This handleLogin function is now hardcoded for the 'admin' role
  const handleLogin = () => {
    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }
    // We will update the login function in AuthContext next
    login(email, password, 'admin', navigation); 
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/BetterU-login-removebg-preview.png')}
          style={styles.headerImage}
        />

        {/* --- CHANGED: Title is now specific to Admin --- */}
        <Text style={styles.title}>Admin Login</Text>
        <Text style={styles.subtitle}>Please enter your credentials</Text>

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
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login as Admin</Text>
        </TouchableOpacity>
        
        {/* --- REMOVED: Role icons and signup link are not needed here --- */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>
            Not an Admin? <Text style={{ fontWeight: 'bold' }}>Go Back</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles are mostly the same, with a new style for the "Go Back" text
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
    height: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
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
    marginBottom: 20, // Added margin
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
  loginButton: { 
    backgroundColor: theme.primary, 
    paddingVertical: 18, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 25
  },
  loginButtonText: { 
    color: theme.card, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  goBackText: { 
    textAlign: 'center', 
    color: theme.secondaryText, 
    fontSize: 16 
  },
});

export default AdminLoginScreen;
