import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


// Receive unreadCount and onNotificationPress as props
const AppHeader = ({ unreadCount = 0, onNotificationPress }) => {
  const navigation = useNavigation();

const onProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>𝓑𝓮𝓽𝓽𝓮𝓻𝓤</Text>

      <View style={styles.rightContainer}>

      {/* --- 1. Notification Bell --- */}
        {/* Only show this button if onNotificationPress is passed (e.g., Home Screen) */}
        {onNotificationPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
                <Ionicons name="notifications-outline" size={26} color="#333" />
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        )}

        {/* --- Profile Avatar --- */}
        <TouchableOpacity onPress={onProfilePress}>
          <Image 
            source={{ uri: 'https://placehold.co/100x100/E0E0E0/333?text= ' }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f4f8', // Match the screen background
    width: '100%',
  },
  logo: {
    fontSize: 32, // Increased base size
    fontWeight: 'bold',
    color: '#1e3a8a',
    // This stretches the text vertically (Y-axis) by 20%
    transform: [{ scaleY: 1.2 }], 
    // Adding a tiny margin to prevent clipping due to the scale
    marginVertical: 2, 
    marginLeft: 5, // Just to balance the scale visually
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15, // Space between bell and avatar
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f0f4f8'
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  loginButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loginText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default AppHeader;
