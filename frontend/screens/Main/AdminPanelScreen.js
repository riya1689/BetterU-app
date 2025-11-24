import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AdminPanelScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>Select an option to manage</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
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
