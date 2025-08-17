import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; 
import { useTheme } from '../../store/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();

  // This function is now just for the main "user" login button.
  const handleUserLogin = () => {
    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }
    // We will update the login function in AuthContext to accept a 'role'
    login(email, password, 'user', navigation); 
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

        {/* --- UPDATED: Main login button now calls handleUserLogin --- */}
        <TouchableOpacity style={styles.loginButton} onPress={handleUserLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.line} />
        </View>

        <View style={styles.roleLoginContainer}>
            {/* --- UPDATED: Admin icon now navigates to AdminLoginScreen --- */}
            <TouchableOpacity 
                style={styles.roleButton} 
                onPress={() => navigation.navigate('AdminLogin')}
            >
                <View style={styles.roleIconContainer}>
                    <FontAwesome5 name="user-cog" size={28} color={theme.primary} />
                </View>
                <Text style={styles.roleText}>Admin</Text>
            </TouchableOpacity>

            {/* --- UPDATED: Doctor icon now navigates to ExpertLoginScreen --- */}
            <TouchableOpacity 
                style={styles.roleButton} 
                onPress={() => navigation.navigate('ExpertLogin')}
            >
                <View style={styles.roleIconContainer}>
                    <FontAwesome5 name="user-md" size={28} color={theme.primary} />
                </View>
                <Text style={styles.roleText}>Doctor</Text>
            </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up Now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles remain the same ---
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
        marginBottom: 30,
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
      separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
      },
      line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.border,
      },
      separatorText: {
        marginHorizontal: 10,
        color: theme.secondaryText,
        fontSize: 14,
        fontWeight: '500',
      },
      roleLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      },
      roleButton: {
        alignItems: 'center',
        marginHorizontal: 25,
      },
      roleIconContainer: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.card,
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      roleText: {
        color: theme.text,
        fontSize: 14,
        fontWeight: '600',
      },
});

export default LoginScreen;
