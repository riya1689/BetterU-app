import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Animated, Image, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const API_BASE_URL = Constants.expoConfig?.extra?.api_url ?? process.env.EXPO_PUBLIC_API_URL;

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
  const { user } = useAuth();
  const { psychologist } = route.params;

  const [appointmentType, setAppointmentType] = useState('new'); // 'new', 'followup', 'reschedule'
  
  // --- NEW FIELDS ---
  const [previousBookingId, setPreviousBookingId] = useState('');
  const [prescription, setPrescription] = useState(null); // Stores file info or text

  const [problem, setProblem] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(500)).current;

  const themedStyles = styles(theme);

  useEffect(() => {
    const availableDates = getNextSevenDays();
    setDates(availableDates);
    setSelectedDate(availableDates[0].fullDate);
  }, []);

  // Clear fields when type changes to avoid confusion
  useEffect(() => {
    setPreviousBookingId('');
    setPrescription(null);
  }, [appointmentType]);


  // --- MOCK FUNCTION FOR UPLOADING PRESCRIPTION ---
  // In real app, use expo-image-picker here
  const handleUploadPrescription = () => {
    Alert.alert("Upload", "File Picker would open here.", [
        { text: "Cancel" },
        { text: "Simulate Success", onPress: () => setPrescription({ name: 'prescription_doc.pdf' }) }
    ]);
  };

  const calculateFees = () => {
    const basePrice = psychologist.price;
    const platformFee = 50;
    
    let sessionFee = basePrice;
    let finalTotal = 0;

    if (appointmentType === 'new') {
        sessionFee = basePrice;
        finalTotal = sessionFee + platformFee;
    } else if (appointmentType === 'followup') {
        sessionFee = Math.round(basePrice * 0.30);
        finalTotal = sessionFee + platformFee;
    } else if (appointmentType === 'reschedule') {
        sessionFee = 0;
        finalTotal = 0; 
    }

    return { sessionFee, platformFee: appointmentType === 'reschedule' ? 0 : platformFee, finalTotal };
  };

  const fees = calculateFees();

  const handleGetAppointment = () => {
    // 1. Basic Validation
    if (!selectedDate || !selectedTime || !problem) {
      Alert.alert('Missing Information', 'Please describe your problem and select a date and time.');
      return;
    }

    // 2. Follow-Up Validation (Prescription Mandatory)
    if (appointmentType === 'followup' && !prescription) {
        Alert.alert('Prescription Required', 'For follow-up sessions, you must provide your previous prescription.');
        return;
    }

    // 3. Reschedule Validation (Previous ID Mandatory)
    if (appointmentType === 'reschedule' && !previousBookingId.trim()) {
        Alert.alert('ID Required', 'Please enter your Previous Booking ID to reschedule.');
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
    if (isLoading) return;
    setIsLoading(true);
    
    if (!user) {
        Alert.alert('Authentication Error', 'You must be logged in.');
        setIsLoading(false);
        return;
    }

    // --- SECURITY CHECK FOR RESCHEDULE ---
    if (appointmentType === 'reschedule') {
        try {
            // We verify BEFORE creating the new order
            const verifyResponse = await fetch(`${API_BASE_URL}/appointment/verify-reschedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    previousBookingId: previousBookingId
                }),
            });
            const verifyResult = await verifyResponse.json();

            if (!verifyResult.success) {
                // Security Check Failed
                Alert.alert("Reschedule Failed", verifyResult.message || "You are not eligible to reschedule this session.");
                setIsLoading(false);
                return; // STOP HERE
            }
            // If success, code continues to booking below...
        } catch (error) {
            console.error("Verification Error", error);
            Alert.alert("Error", "Could not verify booking ID.");
            setIsLoading(false);
            return;
        }
    }

    const uniqueId = 'BETTERU_' + Date.now();

    const orderData = {
      total_amount: fees.finalTotal,
      product_name: `Counselling Session (${appointmentType})`,
      cus_name: user.name,
      cus_email: user.email,
      unique_id: uniqueId,
      item_id: uniqueId,
      user_name: user.name,
      doctor_name: psychologist.name,
      doctor_id: psychologist._id, 
      session_date: selectedDate,
      session_time: selectedTime,
      problem_description: problem,
      user_id: user.id, 
      appointment_type: appointmentType,
      // Add the new fields to payload
      previous_booking_id: previousBookingId,
      prescription_link: prescription ? prescription.name : null, 
    };

    console.log('--- ORDER DATA ---', orderData);

    try {
        if (fees.finalTotal === 0) {
            // Direct Booking for Free Reschedule
            const response = await fetch(`${API_BASE_URL}/appointment/book-free`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            
            const result = await response.json();
            if (result.success) {
                Alert.alert("Success", "Session Rescheduled Successfully!");
                setIsConfirmationVisible(false);
                navigation.navigate('Home'); 
            } else {
                 Alert.alert('Error', result.error || 'Failed to reschedule.');
            }
        } else {
            // Payment Gateway
            const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
    
            const result = await response.json();
    
            if (result.success && result.url) {
                navigation.navigate('Payment', { paymentUrl: result.url });
            } else {
                Alert.alert('Payment Error', result.error || 'Failed to initiate payment.');
            }
        }
    } catch (error) {
      console.error('API call error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setIsLoading(false);
      setIsConfirmationVisible(false);
    }
  };

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Book Session</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        
        {/* Session Type Selector */}
        <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Session Type</Text>
        <View style={themedStyles.typeContainer}>
            <TouchableOpacity 
                style={[themedStyles.typeCard, appointmentType === 'new' && { borderColor: theme.primary, backgroundColor: theme.cardAlt }]}
                onPress={() => setAppointmentType('new')}
            >
                <MaterialCommunityIcons name="account-plus" size={24} color={appointmentType === 'new' ? theme.primary : theme.secondaryText} />
                <Text style={[themedStyles.typeText, { color: theme.text }]}>New</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[themedStyles.typeCard, appointmentType === 'followup' && { borderColor: theme.primary, backgroundColor: theme.cardAlt }]}
                onPress={() => setAppointmentType('followup')}
            >
                <MaterialCommunityIcons name="clipboard-pulse" size={24} color={appointmentType === 'followup' ? theme.primary : theme.secondaryText} />
                <Text style={[themedStyles.typeText, { color: theme.text }]}>Follow Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[themedStyles.typeCard, appointmentType === 'reschedule' && { borderColor: theme.primary, backgroundColor: theme.cardAlt }]}
                onPress={() => setAppointmentType('reschedule')}
            >
                <MaterialCommunityIcons name="calendar-clock" size={24} color={appointmentType === 'reschedule' ? theme.primary : theme.secondaryText} />
                <Text style={[themedStyles.typeText, { color: theme.text }]}>Reschedule</Text>
            </TouchableOpacity>
        </View>

        <Text style={[themedStyles.sectionTitle, { color: theme.text, marginTop: 10 }]}>Patient Details</Text>
        
        {/* --- DYNAMIC FIELDS BASED ON TYPE --- */}

        {/* Prescription Field (Optional for New/Reschedule, Required for FollowUp) */}
        <View style={{ marginBottom: 15 }}>
            <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '500' }}>
                Prescription {appointmentType === 'followup' ? '(Required)' : '(Optional)'}
            </Text>
            <TouchableOpacity 
                style={[themedStyles.uploadButton, { borderColor: theme.border, backgroundColor: theme.card }]}
                onPress={handleUploadPrescription}
            >
                <Ionicons name="cloud-upload-outline" size={24} color={theme.primary} />
                <Text style={{ color: theme.secondaryText, marginLeft: 10 }}>
                    {prescription ? prescription.name : "Tap to upload prescription"}
                </Text>
            </TouchableOpacity>
        </View>

        {/* Reschedule ID Field (Only for Reschedule) */}
        {appointmentType === 'reschedule' && (
             <View style={{ marginBottom: 15 }}>
                <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '500' }}>
                    Previous Booking ID <Text style={{color:'red'}}>*</Text>
                </Text>
                <TextInput
                    style={[themedStyles.inputSingle, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="Enter ID (e.g., BETTERU_1732...)"
                    placeholderTextColor={theme.secondaryText}
                    value={previousBookingId}
                    onChangeText={setPreviousBookingId}
                />
            </View>
        )}

        {/* Problem Description */}
        <Text style={{ color: theme.text, marginBottom: 8, fontWeight: '500' }}>Problem Description</Text>
        <TextInput
            style={[themedStyles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="Describe your current condition..."
            placeholderTextColor={theme.secondaryText}
            value={problem}
            onChangeText={setProblem}
            multiline
        />

        {/* Date & Time Selection (Same as before) */}
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
            <Text style={themedStyles.buttonText}>
                {appointmentType === 'reschedule' ? 'Verify & Reschedule' : 'Proceed to Payment'}
            </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Slide Up */}
      {isConfirmationVisible && (
        <Animated.View style={[themedStyles.confirmationContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={[themedStyles.sessionCard, { backgroundColor: theme.card }]}>
                {imageError ? (
                    <Ionicons name="person-circle-outline" size={60} color={theme.primary} style={themedStyles.doctorImagePlaceholder} />
                ) : (
                    <Image source={{ uri: psychologist.image }} style={themedStyles.doctorImage} onError={() => setImageError(true)} />
                )}
                <View style={themedStyles.sessionDetails}>
                    <Text style={[themedStyles.sessionTitle, { color: theme.text }]}>Session with {psychologist.name}</Text>
                    <Text style={{ color: theme.secondaryText }}>{appointmentType.toUpperCase()}</Text>
                    {appointmentType === 'reschedule' && <Text style={{fontSize: 10, color: theme.secondaryText}}>ID: {previousBookingId}</Text>}
                </View>
            </View>

            <View style={themedStyles.feeContainer}>
                <View style={themedStyles.feeRow}>
                    <Text style={{ color: theme.secondaryText }}>Session Fee</Text>
                    <Text style={{ color: theme.text }}>{fees.sessionFee}৳</Text>
                </View>
                <View style={themedStyles.feeRow}>
                    <Text style={{ color: theme.secondaryText }}>Platform Fee</Text>
                    <Text style={{ color: theme.text }}>{fees.platformFee}৳</Text>
                </View>
                <View style={themedStyles.divider} />
                <View style={themedStyles.feeRow}>
                    <Text style={[themedStyles.totalText, { color: theme.text }]}>Total to Pay</Text>
                    <Text style={[themedStyles.totalText, { color: theme.primary }]}>{fees.finalTotal}৳</Text>
                </View>
            </View>
            
            <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleBookSession} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={themedStyles.buttonText}>
                        {fees.finalTotal === 0 ? 'Confirm Booking' : `Pay ${fees.finalTotal}৳`}
                    </Text>
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
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { padding: 15, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', marginBottom: 20, fontSize: 16, height: 120 },
  inputSingle: { padding: 15, borderRadius: 10, borderWidth: 1, marginBottom: 10, fontSize: 16 },
  uploadButton: { padding: 15, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  
  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeCard: { width: '31%', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', backgroundColor: theme.card },
  typeText: { fontWeight: 'bold', marginTop: 5, fontSize: 13 },

  dateBox: { width: 60, height: 80, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  dateDay: { fontSize: 14 },
  dateText: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  timeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  timeBox: { width: '48%', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  timeText: { fontSize: 16, fontWeight: '500' },
  button: { padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  confirmationContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: theme.background, padding: 20,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderTopWidth: 1, borderColor: theme.border, elevation: 10,
  },
  sessionCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 20 },
  doctorImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  doctorImagePlaceholder: { marginRight: 15 },
  sessionDetails: { flex: 1 },
  sessionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  feeContainer: { marginBottom: 20 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  divider: { height: 1, backgroundColor: theme.border, marginVertical: 10 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
});

export default AppointmentScreen;








// import React, { useState, useEffect, useRef } from 'react';
// import Constants from 'expo-constants';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Animated, Image, ActivityIndicator, Alert } from 'react-native';
// import { useTheme } from '../../store/ThemeContext';
// import { useAuth } from '../../store/AuthContext';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// const API_BASE_URL = Constants.expoConfig?.extra?.api_url ?? process.env.EXPO_PUBLIC_API_URL;

// const getNextSevenDays = () => {
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const dates = [];
//   for (let i = 0; i < 7; i++) {
//     const date = new Date();
//     date.setDate(date.getDate() + i);
//     dates.push({
//       day: days[date.getDay()],
//       date: date.getDate(),
//       fullDate: date.toISOString().split('T')[0],
//     });
//   }
//   return dates;
// };

// const MOCK_TIME_SLOTS = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'];

// const AppointmentScreen = ({ navigation, route }) => {
//   const { theme } = useTheme();
//   const { user } = useAuth();
//   const { psychologist } = route.params;

//   // --- NEW STATE FOR APPOINTMENT TYPE ---
//   const [appointmentType, setAppointmentType] = useState('new'); // 'new', 'followup', 'reschedule'

//   const [problem, setProblem] = useState('');
//   const [dates, setDates] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
//   const slideAnim = useRef(new Animated.Value(500)).current;

//   const themedStyles = styles(theme);

//   useEffect(() => {
//     const availableDates = getNextSevenDays();
//     setDates(availableDates);
//     setSelectedDate(availableDates[0].fullDate);
//   }, []);

//   useEffect(() => {
//     if (!isConfirmationVisible) {
//       setImageError(false);
//     }
//   }, [isConfirmationVisible]);

//   // --- CALCULATE PRICES BASED ON SELECTION ---
//   const calculateFees = () => {
//     const basePrice = psychologist.price;
//     const platformFee = 50;
    
//     let sessionFee = basePrice;
//     let finalTotal = 0;

//     if (appointmentType === 'new') {
//         sessionFee = basePrice;
//         finalTotal = sessionFee + platformFee;
//     } else if (appointmentType === 'followup') {
//         sessionFee = Math.round(basePrice * 0.30); // 30% of full payment
//         finalTotal = sessionFee + platformFee;
//     } else if (appointmentType === 'reschedule') {
//         sessionFee = 0;
//         finalTotal = 0; // 0% Payment
//     }

//     return { sessionFee, platformFee: appointmentType === 'reschedule' ? 0 : platformFee, finalTotal };
//   };

//   const fees = calculateFees();

//   const handleGetAppointment = () => {
//     if (!selectedDate || !selectedTime || !problem) {
//       Alert.alert('Missing Information', 'Please describe your problem and select a date and time.');
//       return;
//     }
//     setIsConfirmationVisible(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleBookSession = async () => {
//     if (isLoading) return;
//     setIsLoading(true);
    
//     if (!user) {
//         Alert.alert('Authentication Error', 'You must be logged in to book a session.');
//         setIsLoading(false);
//         return;
//     }

//     const uniqueId = 'BETTERU_' + Date.now();

//     const orderData = {
//       total_amount: fees.finalTotal,
//       product_name: `Counselling Session (${appointmentType})`,
//       cus_name: user.name,
//       cus_email: user.email,
//       unique_id: uniqueId,
//       item_id: uniqueId,
//       user_name: user.name,
//       doctor_name: psychologist.name,
//       doctor_id: psychologist._id, 
//       session_date: selectedDate,
//       session_time: selectedTime,
//       problem_description: problem,
//       user_id: user.id, 
//       appointment_type: appointmentType, // Send the type to backend
//     };

//     console.log('--- ORDER DATA ---', orderData);

//     try {
//         // --- LOGIC FOR FREE RESCHEDULE (0 Payment) ---
//         if (fees.finalTotal === 0) {
//             // If amount is 0, we don't go to Payment Gateway. We call a direct booking API.
//             // NOTE: You need to create this route on backend, or handle amount=0 in your existing route.
//             const response = await fetch(`${API_BASE_URL}/appointment/book-free`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(orderData),
//             });
            
//             const result = await response.json();
//             if (result.success) {
//                 Alert.alert("Success", "Session Rescheduled Successfully!");
//                 setIsConfirmationVisible(false);
//                 navigation.navigate('Home'); // Or Success Screen
//             } else {
//                  Alert.alert('Error', result.error || 'Failed to reschedule.');
//             }
//         } 
//         // --- LOGIC FOR PAID SESSIONS ---
//         else {
//             const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(orderData),
//             });
    
//             const result = await response.json();
    
//             if (result.success && result.url) {
//                 navigation.navigate('Payment', { paymentUrl: result.url });
//             } else {
//                 Alert.alert('Payment Error', result.error || 'Failed to initiate payment.');
//             }
//         }
//     } catch (error) {
//       console.error('API call error:', error);
//       Alert.alert('Network Error', 'Could not connect to the server.');
//     } finally {
//       setIsLoading(false);
//       setIsConfirmationVisible(false);
//     }
//   };

//   return (
//     <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
//       <View style={themedStyles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={28} color={theme.text} />
//         </TouchableOpacity>
//         <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Book Session</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        
//         {/* --- 1. APPOINTMENT TYPE SELECTOR --- */}
//         <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Session Type</Text>
//         <View style={themedStyles.typeContainer}>
//             {/* New Appointment Option */}
//             <TouchableOpacity 
//                 style={[themedStyles.typeCard, appointmentType === 'new' && { borderColor: theme.primary, backgroundColor: theme.cardAlt }]}
//                 onPress={() => setAppointmentType('new')}
//             >
//                 <MaterialCommunityIcons name="account-plus" size={24} color={appointmentType === 'new' ? theme.primary : theme.secondaryText} />
//                 <Text style={[themedStyles.typeText, { color: theme.text }]}>New</Text>
//                 <Text style={[themedStyles.typeSubText, { color: theme.secondaryText }]}>100% Fee</Text>
//             </TouchableOpacity>

//             {/* Follow Up Option */}
//             <TouchableOpacity 
//                 style={[themedStyles.typeCard, appointmentType === 'followup' && { borderColor: theme.primary, backgroundColor: theme.cardAlt }]}
//                 onPress={() => setAppointmentType('followup')}
//             >
//                 <MaterialCommunityIcons name="clipboard-pulse" size={24} color={appointmentType === 'followup' ? theme.primary : theme.secondaryText} />
//                 <Text style={[themedStyles.typeText, { color: theme.text }]}>Follow Up</Text>
//                 <Text style={[themedStyles.typeSubText, { color: theme.secondaryText }]}>30% Fee</Text>
//             </TouchableOpacity>

//             {/* Reschedule Option */}
//             <TouchableOpacity 
//                 style={[themedStyles.typeCard, appointmentType === 'reschedule' && { borderColor: theme.primary, backgroundColor: theme.cardAlt }]}
//                 onPress={() => setAppointmentType('reschedule')}
//             >
//                 <MaterialCommunityIcons name="calendar-clock" size={24} color={appointmentType === 'reschedule' ? theme.primary : theme.secondaryText} />
//                 <Text style={[themedStyles.typeText, { color: theme.text }]}>Reschedule</Text>
//                 <Text style={[themedStyles.typeSubText, { color: theme.secondaryText }]}>Free</Text>
//             </TouchableOpacity>
//         </View>

//         <Text style={[themedStyles.sectionTitle, { color: theme.text, marginTop: 10 }]}>Patient Details</Text>
//         <TextInput
//             style={[themedStyles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
//             placeholder={appointmentType === 'reschedule' ? "Reason for rescheduling..." : "Describe your problem..."}
//             placeholderTextColor={theme.secondaryText}
//             value={problem}
//             onChangeText={setProblem}
//             multiline
//         />

//         <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Select Date and Time</Text>
//         {/* Date ScrollView */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {dates.map((item) => (
//                 <TouchableOpacity
//                     key={item.fullDate}
//                     style={[themedStyles.dateBox, selectedDate === item.fullDate ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}
//                     onPress={() => setSelectedDate(item.fullDate)}
//                 >
//                     <Text style={[themedStyles.dateDay, selectedDate === item.fullDate ? { color: 'white' } : { color: theme.secondaryText }]}>{item.day}</Text>
//                     <Text style={[themedStyles.dateText, selectedDate === item.fullDate ? { color: 'white' } : { color: theme.text }]}>{item.date}</Text>
//                 </TouchableOpacity>
//             ))}
//         </ScrollView>

//         <View style={themedStyles.timeContainer}>
//             {MOCK_TIME_SLOTS.map((time) => (
//                 <TouchableOpacity
//                     key={time}
//                     style={[themedStyles.timeBox, selectedTime === time ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}
//                     onPress={() => setSelectedTime(time)}
//                 >
//                     <Text style={[themedStyles.timeText, selectedTime === time ? { color: 'white' } : { color: theme.text }]}>{time}</Text>
//                 </TouchableOpacity>
//             ))}
//         </View>

//         <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleGetAppointment}>
//             <Text style={themedStyles.buttonText}>
//                 {appointmentType === 'reschedule' ? 'Confirm Reschedule' : 'Proceed to Payment'}
//             </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* --- CONFIRMATION SLIDE UP --- */}
//       {isConfirmationVisible && (
//         <Animated.View style={[themedStyles.confirmationContainer, { transform: [{ translateY: slideAnim }] }]}>
//             <View style={[themedStyles.sessionCard, { backgroundColor: theme.card }]}>
//                 {imageError ? (
//                     <Ionicons name="person-circle-outline" size={60} color={theme.primary} style={themedStyles.doctorImagePlaceholder} />
//                 ) : (
//                     <Image source={{ uri: psychologist.image }} style={themedStyles.doctorImage} onError={() => setImageError(true)} />
//                 )}
//                 <View style={themedStyles.sessionDetails}>
//                     <Text style={[themedStyles.sessionTitle, { color: theme.text }]}>Session with {psychologist.name}</Text>
//                     <Text style={{ color: theme.secondaryText }}>{appointmentType.toUpperCase()} • {selectedTime}</Text>
//                 </View>
//             </View>

//             <View style={themedStyles.feeContainer}>
//                 <View style={themedStyles.feeRow}>
//                     <Text style={{ color: theme.secondaryText }}>Session Fee {appointmentType === 'followup' && '(30%)'}</Text>
//                     <Text style={{ color: theme.text }}>{fees.sessionFee}৳</Text>
//                 </View>
//                 <View style={themedStyles.feeRow}>
//                     <Text style={{ color: theme.secondaryText }}>Platform Fee</Text>
//                     <Text style={{ color: theme.text }}>{fees.platformFee}৳</Text>
//                 </View>
//                 <View style={themedStyles.divider} />
//                 <View style={themedStyles.feeRow}>
//                     <Text style={[themedStyles.totalText, { color: theme.text }]}>Total to Pay</Text>
//                     <Text style={[themedStyles.totalText, { color: theme.primary }]}>{fees.finalTotal}৳</Text>
//                 </View>
//             </View>
            
//             <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleBookSession} disabled={isLoading}>
//                 {isLoading ? (
//                     <ActivityIndicator color="white" />
//                 ) : (
//                     <Text style={themedStyles.buttonText}>
//                         {fees.finalTotal === 0 ? 'Confirm Booking' : `Pay ${fees.finalTotal}৳`}
//                     </Text>
//                 )}
//             </TouchableOpacity>
//         </Animated.View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = (theme) => StyleSheet.create({
//   container: { flex: 1 },
//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
//   headerTitle: { fontSize: 20, fontWeight: 'bold' },
//   scrollContent: { padding: 20, paddingBottom: 100 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
//   input: { padding: 15, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', marginBottom: 20, fontSize: 16, height: 120 },
  
//   // New Styles for Type Selector
//   typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
//   typeCard: { width: '31%', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', backgroundColor: theme.card },
//   typeText: { fontWeight: 'bold', marginTop: 5, fontSize: 13 },
//   typeSubText: { fontSize: 11, marginTop: 2 },

//   dateBox: { width: 60, height: 80, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
//   dateDay: { fontSize: 14 },
//   dateText: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
//   timeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
//   timeBox: { width: '48%', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
//   timeText: { fontSize: 16, fontWeight: '500' },
//   button: { padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//   confirmationContainer: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     backgroundColor: theme.background, padding: 20,
//     borderTopLeftRadius: 20, borderTopRightRadius: 20,
//     borderTopWidth: 1, borderColor: theme.border, elevation: 10,
//   },
//   sessionCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 20 },
//   doctorImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
//   doctorImagePlaceholder: { marginRight: 15 },
//   sessionDetails: { flex: 1 },
//   sessionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
//   feeContainer: { marginBottom: 20 },
//   feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
//   divider: { height: 1, backgroundColor: theme.border, marginVertical: 10 },
//   totalText: { fontSize: 18, fontWeight: 'bold' },
// });

// export default AppointmentScreen;











// import React, { useState, useEffect, useRef } from 'react';
// import Constants from 'expo-constants';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Animated, Image, ActivityIndicator, Alert, Linking } from 'react-native';
// import { useTheme } from '../../store/ThemeContext';
// // UNCOMMENTED: Access the user object from the AuthContext
// import { useAuth } from '../../store/AuthContext';
// import { Ionicons } from '@expo/vector-icons';

// //const API_BASE_URL = 'http://192.168.0.101:5000/api';
// //const API_BASE_URL = 'https://betteru-backend.onrender.com/api';
// const API_BASE_URL = Constants.expoConfig?.extra?.api_url ?? process.env.EXPO_PUBLIC_API_URL;

// const getNextSevenDays = () => {
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const dates = [];
//   for (let i = 0; i < 7; i++) {
//     const date = new Date();
//     date.setDate(date.getDate() + i);
//     dates.push({
//       day: days[date.getDay()],
//       date: date.getDate(),
//       fullDate: date.toISOString().split('T')[0],
//     });
//   }
//   return dates;
// };

// const MOCK_TIME_SLOTS = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'];

// const AppointmentScreen = ({ navigation, route }) => {
//   const { theme } = useTheme();
//   // UNCOMMENTED: Now using the useAuth hook to get the user object
//   const { user } = useAuth();
//   const { psychologist } = route.params;

//   const [problem, setProblem] = useState('');
//   const [dates, setDates] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
//   const slideAnim = useRef(new Animated.Value(500)).current;

//   useEffect(() => {
//     const availableDates = getNextSevenDays();
//     setDates(availableDates);
//     setSelectedDate(availableDates[0].fullDate);
//   }, []);

//   useEffect(() => {
//     if (!isConfirmationVisible) {
//       setImageError(false);
//     }
//   }, [isConfirmationVisible]);


//   const handleGetAppointment = () => {
//     if (!selectedDate || !selectedTime || !problem) {
//       Alert.alert('Missing Information', 'Please describe your problem and select a date and time.');
//       return;
//     }
//     setIsConfirmationVisible(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleBookSession = async () => {
//     console.log('Inspecting user object:', user);
//     if (isLoading) return;
//     setIsLoading(true);
    
//     if (!user) {
//         Alert.alert('Authentication Error', 'You must be logged in to book a session.');
//         setIsLoading(false);
//         return;
//     }

//     const sessionFee = psychologist.price;
//     const platformFee = 50;
//     const totalAmount = sessionFee + platformFee;

//     const uniqueId = 'BETTERU_' + Date.now();

//     const orderData = {
//       total_amount: totalAmount,
//       product_name: 'Counselling Session',
//       cus_name: user.name,
//       cus_email: user.email,
      
//       unique_id: uniqueId,
//       item_id: uniqueId,
//       user_name: user.name,
//       doctor_name: psychologist.name,
//       doctor_id: psychologist._id, //ADD THIS LINE
//       session_date: selectedDate,
//       session_time: selectedTime,
//       problem_description: problem,
//       //user_id: user._id, // Make sure you are sending _id, not id
//       user_id: user.id, // ✅ CORRECTED: Use 'user.id' instead of 'user._id'
//     };

//     // ADD THIS LOG
//     console.log('--- 1. SENDING ORDER DATA ---');
//     console.log(JSON.stringify(orderData, null, 2));



//     try {
//       const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//       });

//       const result = await response.json();

//       console.log('--- 4. RECEIVED RESPONSE FROM BACKEND ---');
//       console.log(JSON.stringify(result, null, 2));

//       if (result.success && result.url) {
//         // Navigate to your PaymentScreen and pass the URL to it
//         navigation.navigate('Payment', { paymentUrl: result.url });
//       } else {
//         Alert.alert('Payment Error', result.error || 'Failed to initiate payment.');
//       }
//     } catch (error) {
//       console.error('API call error:', error);
//       Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
//     } finally {
//       setIsLoading(false);
//       setIsConfirmationVisible(false);
//     }
//   };

//   const themedStyles = styles(theme);

//   return (
//     <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
//       <View style={themedStyles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={28} color={theme.text} />
//         </TouchableOpacity>
//         <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Appointment</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       <ScrollView contentContainerStyle={themedStyles.scrollContent}>
//         <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Patient Details</Text>
//         <TextInput
//             style={[themedStyles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
//             placeholder="Please describe your problem..."
//             placeholderTextColor={theme.secondaryText}
//             value={problem}
//             onChangeText={setProblem}
//             multiline
//         />
//         <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Select Date and Time</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {dates.map((item) => (
//                 <TouchableOpacity
//                     key={item.fullDate}
//                     style={[themedStyles.dateBox, selectedDate === item.fullDate ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}
//                     onPress={() => setSelectedDate(item.fullDate)}
//                 >
//                     <Text style={[themedStyles.dateDay, selectedDate === item.fullDate ? { color: 'white' } : { color: theme.secondaryText }]}>{item.day}</Text>
//                     <Text style={[themedStyles.dateText, selectedDate === item.fullDate ? { color: 'white' } : { color: theme.text }]}>{item.date}</Text>
//                 </TouchableOpacity>
//             ))}
//         </ScrollView>
//         <View style={themedStyles.timeContainer}>
//             {MOCK_TIME_SLOTS.map((time) => (
//                 <TouchableOpacity
//                     key={time}
//                     style={[themedStyles.timeBox, selectedTime === time ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}
//                     onPress={() => setSelectedTime(time)}
//                 >
//                     <Text style={[themedStyles.timeText, selectedTime === time ? { color: 'white' } : { color: theme.text }]}>{time}</Text>
//                 </TouchableOpacity>
//             ))}
//         </View>

//         <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleGetAppointment}>
//             <Text style={themedStyles.buttonText}>Get Appointment</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {isConfirmationVisible && (
//         <Animated.View style={[themedStyles.confirmationContainer, { transform: [{ translateY: slideAnim }] }]}>
//             <View style={[themedStyles.sessionCard, { backgroundColor: theme.card }]}>
//                 {imageError ? (
//                     <Ionicons name="person-circle-outline" size={60} color={theme.primary} style={themedStyles.doctorImagePlaceholder} />
//                 ) : (
//                     <Image
//                         source={{ uri: psychologist.image }}
//                         style={themedStyles.doctorImage}
//                         onError={() => setImageError(true)}
//                     />
//                 )}
//                 <View style={themedStyles.sessionDetails}>
//                     <Text style={[themedStyles.sessionTitle, { color: theme.text }]}>Your session with {psychologist.name}</Text>
//                     <Text style={{ color: theme.secondaryText }}>Time: {selectedTime}</Text>
//                 </View>
//             </View>

//             <View style={themedStyles.feeContainer}>
//                 <View style={themedStyles.feeRow}>
//                     <Text style={{ color: theme.secondaryText }}>Session Fee</Text>
//                     <Text style={{ color: theme.text }}>{psychologist.price}৳</Text>
//                 </View>
//                 <View style={themedStyles.feeRow}>
//                     <Text style={{ color: theme.secondaryText }}>Platform Fee</Text>
//                     <Text style={{ color: theme.text }}>50৳</Text>
//                 </View>
//                 <View style={themedStyles.divider} />
//                 <View style={themedStyles.feeRow}>
//                     <Text style={[themedStyles.totalText, { color: theme.text }]}>Total</Text>
//                     <Text style={[themedStyles.totalText, { color: theme.text }]}>{psychologist.price + 50}৳</Text>
//                 </View>
//             </View>
            
//             <TouchableOpacity style={[themedStyles.button, { backgroundColor: theme.primary }]} onPress={handleBookSession} disabled={isLoading}>
//                 {isLoading ? (
//                     <ActivityIndicator color="white" />
//                 ) : (
//                     <Text style={themedStyles.buttonText}>Book Session</Text>
//                 )}
//             </TouchableOpacity>
//         </Animated.View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = (theme) => StyleSheet.create({
//   container: { flex: 1 },
//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
//   headerTitle: { fontSize: 20, fontWeight: 'bold' },
//   scrollContent: { padding: 20 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
//   input: { padding: 15, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', marginBottom: 20, fontSize: 16, height: 120 },
//   dateBox: { width: 60, height: 80, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
//   dateDay: { fontSize: 14 },
//   dateText: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
//   timeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
//   timeBox: { width: '48%', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
//   timeText: { fontSize: 16, fontWeight: '500' },
//   button: { padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 30 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//   confirmationContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: theme.background,
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     borderTopWidth: 1,
//     borderColor: theme.border,
//     elevation: 10,
//   },
//   sessionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   doctorImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 15,
//   },
//   doctorImagePlaceholder: {
//     marginRight: 15,
//   },
//   sessionDetails: {
//     flex: 1,
//   },
//   sessionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   feeContainer: {
//     marginBottom: 20,
//   },
//   feeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: theme.border,
//     marginVertical: 10,
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default AppointmentScreen;


