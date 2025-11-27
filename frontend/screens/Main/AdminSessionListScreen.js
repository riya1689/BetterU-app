import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AdminSessionListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // --- MOCK DATA ---
  const [sessions, setSessions] = useState([
    {
      id: 'TXN_1732645001',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Wilson',
      sessionDate: '2025-11-28',
      sessionTime: '10:00 AM',
      amount: '1550',
      status: 'Paid',
      type: 'New'
    },
    {
      id: 'TXN_1732645002',
      patientName: 'Riya Khan',
      doctorName: 'Dr. Ayesha Siddiqua',
      sessionDate: '2025-11-29',
      sessionTime: '02:30 PM',
      amount: '500',
      status: 'Paid',
      type: 'Follow Up'
    },
    {
      id: 'TXN_1732645003',
      patientName: 'Mike Ross',
      doctorName: 'Dr. Robert Ford',
      sessionDate: '2025-11-30',
      sessionTime: '09:00 AM',
      amount: '0', 
      status: 'Rescheduled',
      type: 'Reschedule'
    },
  ]);

  const renderSessionItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header: ID & Status */}
      <View style={styles.cardHeader}>
        <Text style={styles.trxId}>ID: {item.id}</Text>
        <View style={[styles.badge, { backgroundColor: item.amount === '0' ? '#FFA500' : 'green' }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Body: Who booked Whom */}
      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
            <Text style={styles.label}>Patient</Text>
            <Text style={styles.value}>{item.patientName}</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={theme.secondaryText} style={{marginTop: 10}} />
        <View style={styles.infoColumn}>
            <Text style={[styles.label, {textAlign:'right'}]}>Doctor</Text>
            <Text style={[styles.value, {textAlign:'right'}]}>{item.doctorName}</Text>
        </View>
      </View>

      {/* Footer: Date & Amount */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.primary} />
            <Text style={styles.footerText}>{item.sessionDate} at {item.sessionTime}</Text>
        </View>
        <Text style={[styles.amountText, { color: theme.primary }]}>৳ {item.amount}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Global Booking Manager</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search (Visual Only) */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.secondaryText} style={styles.searchIcon} />
        <TextInput 
            placeholder="Search Patient or Transaction ID..." 
            placeholderTextColor={theme.secondaryText}
            style={styles.searchInput}
        />
      </View>

      {/* List */}
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, margin: 20, marginBottom: 10, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: theme.border, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: theme.text },
  listContent: { padding: 20 },
  card: { backgroundColor: theme.card, borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: theme.border, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  trxId: { fontSize: 11, color: theme.secondaryText, fontFamily: 'monospace' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: theme.border, marginVertical: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  infoColumn: { flex: 1 },
  label: { fontSize: 11, color: theme.secondaryText, marginBottom: 2 },
  value: { fontSize: 15, fontWeight: 'bold', color: theme.text },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.background, padding: 10, borderRadius: 8 },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { marginLeft: 5, color: theme.text, fontSize: 12 },
  amountText: { fontWeight: 'bold', fontSize: 14 },
});

export default AdminSessionListScreen;