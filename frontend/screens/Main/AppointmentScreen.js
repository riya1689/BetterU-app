import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Animated, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
// UNCOMMENTED: Access the user object from the AuthContext
import { useAuth } from '../../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'http://192.168.0.101:5000/api';
//const API_BASE_URL = 'https://192.168.1.5:5000/api';

const getNextSevenDays = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      day: days[date.getDay()],
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0],
    });
  }
  return dates;
};

const MOCK_TIME_SLOTS = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'];

const AppointmentScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  // UNCOMMENTED: Now using the useAuth hook to get the user object
  const { user } = useAuth();
  const { psychologist } = route.params;

  const [problem, setProblem] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    const availableDates = getNextSevenDays();
    setDates(availableDates);
    setSelectedDate(availableDates[0].fullDate);
  }, []);

  useEffect(() => {
    if (!isConfirmationVisible) {
      setImageError(false);
    }
  }, [isConfirmationVisible]);


  const handleGetAppointment = () => {
    if (!selectedDate || !selectedTime || !problem) {
      Alert.alert('Missing Information', 'Please describe your problem and select a date and time.');
      return;
    }
    setIsConfirmationVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBookSession = async () => {
    console.log('Inspecting user object:', user);
    if (isLoading) return;
    setIsLoading(true);
    
    if (!user) {
        Alert.alert('Authentication Error', 'You must be logged in to book a session.');
        setIsLoading(false);
        return;
    }

    const sessionFee = psychologist.price;
    const platformFee = 50;
    const totalAmount = sessionFee + platformFee;

    const uniqueId = 'BETTERU_' + Date.now();

    const orderData = {
      total_amount: totalAmount,
      product_name: 'Counselling Session',
      cus_name: user.name,
      cus_email: user.email,
      
      unique_id: uniqueId,
      item_id: uniqueId,
      user_name: user.name,
      doctor_name: psychologist.name,
      doctor_id: psychologist._id, //ADD THIS LINE
      session_date: selectedDate,
      session_time: selectedTime,
      problem_description: problem,
      //user_id: user._id, // Make sure you are sending _id, not id
      user_id: user.id, // ✅ CORRECTED: Use 'user.id' instead of 'user._id'
    };

    // ADD THIS LOG
    console.log('--- 1. SENDING ORDER DATA ---');
    console.log(JSON.stringify(orderData, null, 2));



    try {
      const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      console.log('--- 4. RECEIVED RESPONSE FROM BACKEND ---');
      console.log(JSON.stringify(result, null, 2));

      if (result.success && result.url) {
        // Navigate to your PaymentScreen and pass the URL to it
        navigation.navigate('Payment', { paymentUrl: result.url });
      } else {
        Alert.alert('Payment Error', result.error || 'Failed to initiate payment.');
      }
    } catch (error) {
      console.error('API call error:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
      setIsConfirmationVisible(false);
    }
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
                {imageError ? (
                    <Ionicons name="person-circle-outline" size={60} color={theme.primary} style={themedStyles.doctorImagePlaceholder} />
                ) : (
                    <Image
                        source={{ uri: psychologist.image }}
                        style={themedStyles.doctorImage}
                        onError={() => setImageError(true)}
                    />
                )}
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
            
            <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleBookSession} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={themedStyles.buttonText}>Book Session</Text>
                )}
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
  doctorImagePlaceholder: {
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


