import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';

const NotificationScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const styles = getStyles(theme);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // To show spinner on specific button

  // --- Fetch Notifications ---
  const fetchNotifications = async () => {
    try {
      let token = user?.token;
      if (!token) token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch('http://10.0.2.2:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
        // Mark all as read immediately (optional, or do it on click)
        markAllRead(token); 
      }
    } catch (error) {
      console.error("Fetch Notifications Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAllRead = async (token) => {
    try {
        await fetch('http://10.0.2.2:5000/api/notifications/mark-all-read', {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (e) {
        console.log("Mark read error", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  // --- ADMIN ACTION: Approve Application ---
  const handleApprove = async (notification) => {
    const applicationId = notification.relatedId;
    if (!applicationId) return;

    setActionLoading(notification._id); // Show spinner on this card

    try {
      let token = user?.token;
      if (!token) token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`http://10.0.2.2:5000/api/admin/applications/${applicationId}/approve`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Doctor Application Approved!");
        // Refresh list to potentially remove actions or update text
        fetchNotifications();
      } else {
        Alert.alert("Error", data.message || "Failed to approve.");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // --- ADMIN ACTION: Reject Application ---
  const handleReject = async (notification) => {
    const applicationId = notification.relatedId;
    if (!applicationId) return;

    Alert.alert(
        "Confirm Reject",
        "Are you sure you want to reject this application?",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Reject", 
                style: 'destructive',
                onPress: async () => {
                    setActionLoading(notification._id);
                    try {
                        let token = user?.token;
                        if (!token) token = await AsyncStorage.getItem('userToken');

                        const response = await fetch(`http://10.0.2.2:5000/api/admin/applications/${applicationId}/reject`, {
                            method: 'PUT',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (response.ok) {
                            Alert.alert("Rejected", "Application has been rejected.");
                            fetchNotifications();
                        } else {
                            Alert.alert("Error", "Failed to reject.");
                        }
                    } catch (error) {
                        Alert.alert("Error", "Server error.");
                    } finally {
                        setActionLoading(null);
                    }
                }
            }
        ]
    );
  };

  // --- Render Item ---
  const renderItem = ({ item }) => {
    // Check if it's a Job Application that needs action
    const isJobApplication = item.type === 'job_application';
    const isAdmin = user?.role === 'admin';
    const showActions = isJobApplication && isAdmin;

    return (
      <View style={[styles.card, !item.isRead && styles.unreadCard]}>
        <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary + '20' }]}>
                <Ionicons 
                    name={item.type === 'job_application' ? "briefcase" : "information-circle"} 
                    size={24} 
                    color={theme.primary} 
                />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
        </View>

        {/* --- Action Buttons (Only for Admin & Job Applications) --- */}
        {showActions && (
            <View style={styles.actionContainer}>
                {actionLoading === item._id ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                    <>
                        <TouchableOpacity 
                            style={[styles.btn, styles.approveBtn]} 
                            onPress={() => handleApprove(item)}
                        >
                            <Text style={styles.btnText}>Approve</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.btn, styles.rejectBtn]} 
                            onPress={() => handleReject(item)}
                        >
                            <Text style={styles.btnText}>Reject</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={50} color={theme.secondaryText} />
                <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No notifications yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: theme.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: { marginRight: 15 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: theme.cardBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderColor: theme.primary,
    borderWidth: 1.5,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
  },
  message: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
      marginBottom: 5,
  },
  date: {
      fontSize: 12,
      color: theme.secondaryText,
  },
  // --- Actions ---
  actionContainer: {
      flexDirection: 'row',
      marginTop: 15,
      justifyContent: 'flex-end',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 10,
  },
  btn: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginLeft: 10,
  },
  approveBtn: {
      backgroundColor: 'green',
  },
  rejectBtn: {
      backgroundColor: 'red',
  },
  btnText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: 50,
  },
  emptyText: {
      marginTop: 10,
      fontSize: 16,
  }
});

export default NotificationScreen;