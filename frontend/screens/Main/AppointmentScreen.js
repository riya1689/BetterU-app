import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Animated, Image } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Helper function to generate the next 7 days
const getNextSevenDays = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      day: days[date.getDay()],
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD
    });
  }
  return dates;
};

// Mock data for time slots
const MOCK_TIME_SLOTS = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'];

const AppointmentScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { psychologist } = route.params;

  const [problem, setProblem] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    const availableDates = getNextSevenDays();
    setDates(availableDates);
    setSelectedDate(availableDates[0].fullDate);
  }, []);

  const handleGetAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time.');
      return;
    }
    setIsConfirmationVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  // --- UPDATED FUNCTION TO NAVIGATE ---
  const handleBookSession = () => {
      // In a real app, you would first save the appointment to your backend,
      // then get a real payment URL to pass to the PaymentScreen.
      navigation.navigate('Payment');
  };

  const themedStyles = styles(theme);

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Appointment</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Patient Details</Text>
        <TextInput
            style={[themedStyles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="Please describe your problem..."
            placeholderTextColor={theme.secondaryText}
            value={problem}
            onChangeText={setProblem}
            multiline
        />
        <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Select Date and Time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((item) => (
                <TouchableOpacity 
                    key={item.fullDate} 
                    style={[themedStyles.dateBox, selectedDate === item.fullDate ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}
                    onPress={() => setSelectedDate(item.fullDate)}
                >
                    <Text style={[themedStyles.dateDay, selectedDate === item.fullDate ? { color: 'white' } : { color: theme.secondaryText }]}>{item.day}</Text>
                    <Text style={[themedStyles.dateText, selectedDate === item.fullDate ? { color: 'white' } : { color: theme.text }]}>{item.date}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        <View style={themedStyles.timeContainer}>
            {MOCK_TIME_SLOTS.map((time) => (
                <TouchableOpacity 
                    key={time}
                    style={[themedStyles.timeBox, selectedTime === time ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}
                    onPress={() => setSelectedTime(time)}
                >
                    <Text style={[themedStyles.timeText, selectedTime === time ? { color: 'white' } : { color: theme.text }]}>{time}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleGetAppointment}>
            <Text style={themedStyles.buttonText}>Get Appointment</Text>
        </TouchableOpacity>
      </ScrollView>

      {isConfirmationVisible && (
        <Animated.View style={[themedStyles.confirmationContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={[themedStyles.sessionCard, { backgroundColor: theme.card }]}>
                <Image source={{ uri: psychologist.image }} style={themedStyles.doctorImage} />
                <View style={themedStyles.sessionDetails}>
                    <Text style={[themedStyles.sessionTitle, { color: theme.text }]}>Your session with {psychologist.name}</Text>
                    <Text style={{ color: theme.secondaryText }}>Time: {selectedTime}</Text>
                </View>
            </View>

            <View style={themedStyles.feeContainer}>
                <View style={themedStyles.feeRow}>
                    <Text style={{ color: theme.secondaryText }}>Session Fee</Text>
                    <Text style={{ color: theme.text }}>{psychologist.price}৳</Text>
                </View>
                <View style={themedStyles.feeRow}>
                    <Text style={{ color: theme.secondaryText }}>Platform Fee</Text>
                    <Text style={{ color: theme.text }}>50৳</Text>
                </View>
                <View style={themedStyles.divider} />
                <View style={themedStyles.feeRow}>
                    <Text style={[themedStyles.totalText, { color: theme.text }]}>Total</Text>
                    <Text style={[themedStyles.totalText, { color: theme.text }]}>{psychologist.price + 50}৳</Text>
                </View>
            </View>

            <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleBookSession}>
                <Text style={themedStyles.buttonText}>Book Session</Text>
            </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { padding: 15, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', marginBottom: 20, fontSize: 16, height: 120 },
  dateBox: { width: 60, height: 80, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  dateDay: { fontSize: 14 },
  dateText: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  timeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  timeBox: { width: '48%', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  timeText: { fontSize: 16, fontWeight: '500' },
  button: { padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  confirmationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: theme.border,
    elevation: 10,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  feeContainer: {
    marginBottom: 20,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AppointmentScreen;
