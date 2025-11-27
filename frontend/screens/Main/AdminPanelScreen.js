import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ActivityIndicator ,
  ScrollView
} from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext'; // <--- THIS WAS MISSING
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminPanelScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = getStyles(theme);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Fetch Unread Count ---
  const fetchUnreadCount = async () => {
    try {
      let token = user?.token;
      if (!token) {
        token = await AsyncStorage.getItem('userToken');
      }

      if (!token) return;

      const response = await fetch('http://10.0.2.2:5000/api/notifications/unread-count', {
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
      <View style={styles.header}>
        <View>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>Select an option to manage</Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity 
          style={styles.notificationButton} 
          // We will build 'Notifications' screen in the next step
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

      <View style={styles.menuContainer}>
        {/* Manage Users Card */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('UserList', { userType: 'user' })}
        >
          <Ionicons name="people-outline" size={32} color={theme.primary} />
          <Text style={styles.menuItemText}>Manage Users</Text>
        </TouchableOpacity>

        {/* Manage Doctors Card */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('UserList', { userType: 'doctor' })}
        >
          <Ionicons name="medkit-outline" size={32} color={theme.primary} />
          <Text style={styles.menuItemText}>Manage Doctors</Text>
        </TouchableOpacity>

          {/* --- NEW SECTION: Global Booking Manager --- */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('AdminSessionList')} // Navigates to the new screen
        >
          <Ionicons name="calendar-outline" size={32} color={theme.primary} />
          <Text style={styles.menuItemText}>Booked Sessions</Text>
        </TouchableOpacity>
        {/* ------------------------------------------- */}

        {/* --- Manage Job Circulars --- */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('AdminJobManager')}
        >
          <Ionicons name="briefcase-outline" size={32} color={theme.primary} />
          <Text style={styles.menuItemText}>Job Circulars</Text>
        </TouchableOpacity>

        {/* --- Manage Applications --- */}
        <TouchableOpacity 
           style={styles.menuItem}
           // We will create this screen later or if you have it
           onPress={() => console.log('Applications Screen coming soon')}
        >
           <Ionicons name="documents-outline" size={32} color={theme.primary} />
           <Text style={styles.menuItemText}>Applications</Text>
        </TouchableOpacity>
      </View>
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
  },
  subtitle: {
    fontSize: 18,
    color: theme.secondaryText,
    marginTop: 8,
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

  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: theme.card,
    padding: 25,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  menuItemText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 20,
  },
});

export default AdminPanelScreen;
