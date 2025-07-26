import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { useNavigation } from '@react-navigation/native';
import ToastMessage from '../../components/common/ToastMessage';

// Reusable component for the menu items
const ProfileMenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemIcon}>{icon}</Text>
    <Text style={styles.menuItemText}>{text}</Text>
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth(); // Get user and logout function from our context
  const [toastVisible, setToastVisible] = useState(false);

  const handleLockedFeature = () => {
    // If a logged-out user clicks a locked item, show the toast message.
    if (!user) {
      setToastVisible(true);
    }
    // If the user is logged in, this would navigate to the feature.
    // For now, we can just log a message.
    else {
        alert('This feature is coming soon!');
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };
  
  const handleLogout = () => {
    // --- CHANGE: Pass the navigation object to the logout function ---
    logout(navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          // We can add the user's real avatar later
          source={{ uri: 'https://placehold.co/150x150/E0E0E0/333?text= ' }} 
          style={styles.avatar} 
        />
        {/* --- DYNAMIC NAME/MESSAGE --- */}
        {user ? (
          <Text style={styles.userName}>{user.name}</Text>
        ) : (
          <Text style={styles.userName}>Please log in / Sign Up</Text>
        )}
        <Text style={styles.userHandle}>Welcome to BetterU</Text>
      </View>
      
      {/* --- DYNAMIC LOGIN/LOGOUT BUTTONS --- */}
      {!user && (
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      )}

      <View style={styles.menuContainer}>
        <ProfileMenuItem icon="🔖" text="Bookmarks" onPress={handleLockedFeature} />
        <ProfileMenuItem icon="📊" text="Your Analytics" onPress={handleLockedFeature} />
        {/* Only show the Logout button if the user is logged in */}
        {user && (
            <ProfileMenuItem icon="🚪" text="Logout" onPress={handleLogout} />
        )}
      </View>

      {/* --- TEMPORARY TOAST MESSAGE --- */}
      <ToastMessage 
        visible={toastVisible} 
        message="Please log in/Sign Up"
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
    borderColor: '#1e3a8a',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  userHandle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 50,
    marginBottom: 40,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  menuItemIcon: {
    fontSize: 22,
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 18,
    color: '#334155',
    fontWeight: '500',
  },
});

export default ProfileScreen;
