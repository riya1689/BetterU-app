import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';

// This is a reusable component for the list items
const ProfileMenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemIcon}>{icon}</Text>
    <Text style={styles.menuItemText}>{text}</Text>
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const handleLogin = () => alert('Login functionality coming soon!');
  const handleLogout = () => alert('Logout functionality coming soon!');
  const handleBookmarks = () => alert('Bookmarks functionality coming soon!');
  const handleAnalytics = () => alert('Analytics functionality coming soon!');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://placehold.co/150x150/E0E0E0/333?text= ' }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>Riya Das</Text>
        <Text style={styles.userHandle}>Welcome to BetterU</Text>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <ProfileMenuItem icon="🔖" text="Bookmarks" onPress={handleBookmarks} />
        <ProfileMenuItem icon="📊" text="Your Analytics" onPress={handleAnalytics} />
        <ProfileMenuItem icon="🚪" text="Logout" onPress={handleLogout} />
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  userHandle: {
    fontSize: 16,
    color: '#475569',
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
