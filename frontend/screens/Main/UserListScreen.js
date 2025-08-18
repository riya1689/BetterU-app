import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import apiClient from '../../services/apiClient';
import { Ionicons } from '@expo/vector-icons';

const UserListScreen = ({ route }) => {
  const { userType } = route.params; // 'user' or 'doctor'
  const { theme } = useTheme();
  const { token } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const styles = getStyles(theme);
  const title = userType === 'user' ? 'Manage Users' : 'Manage Doctors';
  const endpoint = userType === 'user' ? '/admin/users' : '/admin/doctors';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await apiClient.get(endpoint, config);
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, endpoint]);

  // --- NEW: Function to handle user deletion ---
  const handleDelete = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Note the endpoint structure: /admin/users/:id
      await apiClient.delete(`/admin/users/${userId}`, config);
      
      // Refresh the list by removing the deleted user from the state
      setUsers(currentUsers => currentUsers.filter(user => user._id !== userId));
      
      Alert.alert('Success', 'User has been deleted successfully.');

    } catch (err) {
      Alert.alert('Error', 'Failed to delete user. Please try again.');
      console.error("Deletion Error:", err);
    }
  };

  // --- NEW: Confirmation dialog before deleting ---
  const confirmDelete = (userId, userName) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(userId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemEmail}>{item.email}</Text>
      </View>
      {/* --- NEW: Delete Button --- */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id, item.name)}
      >
        <Ionicons name="trash-outline" size={24} color={'#dc2626'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder={`Search by name or email...`}
        placeholderTextColor={theme.secondaryText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No {userType}s found.</Text>}
          // --- NEW: Add a pull-to-refresh feature ---
          onRefresh={fetchUsers}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.text,
    },
    searchBar: {
        backgroundColor: theme.card,
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        fontSize: 16,
        color: theme.text,
        borderWidth: 1,
        borderColor: theme.border,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        backgroundColor: theme.card,
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // --- NEW: Style to give user info space ---
    userInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text,
    },
    itemEmail: {
        fontSize: 14,
        color: theme.secondaryText,
        marginTop: 4,
    },
    // --- NEW: Style for the delete button ---
    deleteButton: {
        padding: 10,
        marginLeft: 15,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'red',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: theme.secondaryText,
    },
});

export default UserListScreen;
