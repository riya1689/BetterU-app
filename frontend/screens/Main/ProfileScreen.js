import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Switch } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import ToastMessage from '../../components/common/ToastMessage';
import { Ionicons } from '@expo/vector-icons';

// Reusable component for the menu items
const ProfileMenuItem = ({ icon, text, onPress, children, theme }) => (
  <TouchableOpacity style={[styles(theme).menuItem, {backgroundColor: theme.card}]} onPress={onPress} disabled={!!children}>
    <View style={styles(theme).menuItemContent}>
      <Ionicons name={icon} size={22} color={theme.secondaryText} style={styles(theme).menuItemIcon} />
      <Text style={[styles(theme).menuItemText, {color: theme.text}]}>{text}</Text>
    </View>
    {children}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  // --- UPDATED: Get the 'role' from the AuthContext ---
  const { user, logout, role } = useAuth(); 
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const [toastVisible, setToastVisible] = useState(false);

  const handleLockedFeature = () => {
    if (!user) {
      setToastVisible(true);
    } else {
      alert('This feature is coming soon!');
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };
  
  const handleLogout = () => {
    logout(navigation);
  };

  // --- NEW: Navigation handlers for the panels ---
  const handleAdminPanelPress = () => {
    navigation.navigate('AdminPanel');
  };

  const handleDoctorPanelPress = () => {
    // Note: Make sure this name matches your AppNavigator.js
    navigation.navigate('ExpertPanel'); 
  };

  const themedStyles = styles(theme);

  return (
    <SafeAreaView style={[themedStyles.container, {backgroundColor: theme.background}]}>
      <View style={themedStyles.profileHeader}>
        <Image 
          source={{ uri: 'https://placehold.co/150x150/E0E0E0/333?text= ' }} 
          style={[themedStyles.avatar, {borderColor: theme.primary}]} 
        />
        {user ? (
          <Text style={[themedStyles.userName, {color: theme.primary}]}>{user.name}</Text>
        ) : (
          <Text style={[themedStyles.userName, {color: theme.primary}]}>Please log in / Sign Up</Text>
        )}
        <Text style={[themedStyles.userHandle, {color: theme.secondaryText}]}>Welcome to BetterU</Text>
      </View>
      
      {!user && (
        <TouchableOpacity style={[themedStyles.loginButton, {backgroundColor: theme.primary}]} onPress={handleLoginPress}>
          <Text style={[themedStyles.loginButtonText, {color: theme.card}]}>Log In</Text>
        </TouchableOpacity>
      )}

      <View style={themedStyles.menuContainer}>
        <ProfileMenuItem icon="moon-outline" text="Dark Mode" theme={theme}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </ProfileMenuItem>

        <ProfileMenuItem icon="bookmark-outline" text="Bookmarks" onPress={handleLockedFeature} theme={theme} />
        <ProfileMenuItem icon="analytics-outline" text="Your Analytics" onPress={handleLockedFeature} theme={theme} />
        
        {/* --- NEW: Conditional Admin Panel Link --- */}
        {user && role === 'admin' && (
            <ProfileMenuItem 
                icon="shield-checkmark-outline" 
                text="Admin Panel" 
                onPress={handleAdminPanelPress} 
                theme={theme} 
            />
        )}

        {/* --- NEW: Conditional Doctor Panel Link --- */}
        {user && role === 'doctor' && (
            <ProfileMenuItem 
                icon="medkit-outline" 
                text="Doctor Panel" 
                onPress={handleDoctorPanelPress} 
                theme={theme} 
            />
        )}

        {user && (
            <ProfileMenuItem icon="log-out-outline" text="Logout" onPress={handleLogout} theme={theme} />
        )}
      </View>

      <ToastMessage 
        visible={toastVisible} 
        message="Please log in/Sign Up"
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userHandle: {
    fontSize: 16,
    marginTop: 4,
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 50,
    marginBottom: 40,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ProfileScreen;
