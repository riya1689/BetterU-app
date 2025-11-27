import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useTheme } from '../../store/ThemeContext'; // Adjust path if needed
import { Ionicons } from '@expo/vector-icons';

const BookedSessionsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  // --- MOCK DATA (Empty for now as requested) ---
  // When backend is connected, this will be replaced by API data
  const [sessions, setSessions] = useState([]); 

  /* Example Data Structure for later:
  const [sessions, setSessions] = useState([
    {
      id: '1',
      doctorName: 'Dr. Sarah Wilson',
      date: '2025-11-28',
      time: '10:00 AM',
      status: 'Upcoming', // or 'Completed', 'Cancelled'
      type: 'Follow Up',
      image: 'https://link-to-image.com'
    }
  ]);
  */

  const themedStyles = styles(theme);

  const renderSessionItem = ({ item }) => (
    <View style={[themedStyles.card, { backgroundColor: theme.card }]}>
      <View style={themedStyles.cardHeader}>
        <View style={themedStyles.doctorInfo}>
            {/* Placeholder image logic needed later */}
            <View style={[themedStyles.avatarPlaceholder, { backgroundColor: theme.cardAlt }]}>
                <Ionicons name="person" size={24} color={theme.secondaryText} />
            </View>
            <View>
                <Text style={[themedStyles.doctorName, { color: theme.text }]}>{item.doctorName}</Text>
                <Text style={[themedStyles.sessionType, { color: theme.primary }]}>{item.type} Session</Text>
            </View>
        </View>
        <View style={[themedStyles.statusBadge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[themedStyles.statusText, { color: theme.primary }]}>{item.status}</Text>
        </View>
      </View>

      <View style={[themedStyles.divider, { backgroundColor: theme.border }]} />

      <View style={themedStyles.cardFooter}>
        <View style={themedStyles.timeInfo}>
            <Ionicons name="calendar-outline" size={16} color={theme.secondaryText} />
            <Text style={[themedStyles.footerText, { color: theme.secondaryText }]}> {item.date}</Text>
        </View>
        <View style={themedStyles.timeInfo}>
            <Ionicons name="time-outline" size={16} color={theme.secondaryText} />
            <Text style={[themedStyles.footerText, { color: theme.secondaryText }]}> {item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[themedStyles.headerTitle, { color: theme.text }]}>My Sessions</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      {sessions.length === 0 ? (
        // --- EMPTY STATE UI ---
        <View style={themedStyles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={80} color={theme.border} />
            <Text style={[themedStyles.emptyTitle, { color: theme.text }]}>No booked sessions</Text>
            <Text style={[themedStyles.emptySubtitle, { color: theme.secondaryText }]}>
                You haven't booked any appointments yet.
            </Text>
            <TouchableOpacity 
                style={[themedStyles.bookNowBtn, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Home')} // Or wherever your doctor list is
            >
                <Text style={themedStyles.bookNowText}>Book a Session</Text>
            </TouchableOpacity>
        </View>
      ) : (
        // --- LIST UI ---
        <FlatList
            data={sessions}
            renderItem={renderSessionItem}
            keyExtractor={item => item.id}
            contentContainerStyle={themedStyles.listContent}
            showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  // Empty State Styles
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  bookNowBtn: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 30 },
  bookNowText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // List Item Styles
  listContent: { padding: 20 },
  card: { borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  doctorInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  doctorName: { fontWeight: 'bold', fontSize: 16 },
  sessionType: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  timeInfo: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 13, marginLeft: 5 },
});

export default BookedSessionsScreen;