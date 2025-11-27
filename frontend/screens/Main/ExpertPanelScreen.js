import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Use your specific API URL logic here if needed, or hardcode for local testing like AdminPanel
const API_URL = Constants.expoConfig?.extra?.api_url ?? 'http://10.0.2.2:5000/api'; 

const ExpertPanelScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = getStyles(theme);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Fetch Unread Notification Count ---
  // This logic is identical to AdminPanel, allowing Experts to see their specific notification count
  const fetchUnreadCount = async () => {
    try {
      let token = user?.token;
      if (!token) {
        token = await AsyncStorage.getItem('userToken');
      }

      if (!token) return;

      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.log("Notification Fetch Error:", error);
    }
  };

  // Refresh count every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View>
            <Text style={styles.title}>Expert Panel</Text>
            <Text style={styles.subtitle}>Welcome back, {user?.name || 'Doctor'}</Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={() => navigation.navigate('Notifications')} 
        >
          <Ionicons name="notifications-outline" size={28} color={theme.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        
        {/* --- OPTION 1: My Patients (Upcoming Sessions) --- */}
        {/* Initially creates UI, later we will connect to backend to list actual bookings */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            // Placeholder: Navigate to a list screen or alert for now
            // navigation.navigate('ExpertPatientList'); // We will create this screen later
            alert("Patient List (Upcoming Sessions) coming soon!");
          }}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="people" size={32} color={theme.primary} />
          </View>
          <View style={styles.textContainer}>
             <Text style={styles.menuItemText}>My Patients</Text>
             <Text style={styles.menuItemSubText}>View upcoming booked sessions</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.secondaryText} />
        </TouchableOpacity>

        {/* --- OPTION 2: Completed Sessions --- */}
        {/* Initially creates UI, later we will connect to backend history */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            // Placeholder
             alert("Completed Sessions History coming soon!");
          }}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'green' + '20' }]}>
            <Ionicons name="checkmark-done-circle" size={32} color="green" />
          </View>
          <View style={styles.textContainer}>
             <Text style={styles.menuItemText}>Completed Sessions</Text>
             <Text style={styles.menuItemSubText}>View past history & reports</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.secondaryText} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 30,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.cardBackground, // Optional: contrast header
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.secondaryText,
    marginTop: 5,
  },
  // --- Notification Styles ---
  notificationButton: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff'
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // --- Menu Styles ---
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  menuItemSubText: {
    fontSize: 13,
    color: theme.secondaryText,
    marginTop: 2,
  },
});

export default ExpertPanelScreen;






// import React from 'react';
// import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

// const ExpertPanelScreen = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Welcome to the Expert Panel</Text>
//       <Text style={styles.subtitle}>This is a placeholder screen.</Text>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f4f8',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1e3a8a',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6b7280',
//     marginTop: 8,
//   },
// });

// export default ExpertPanelScreen;
