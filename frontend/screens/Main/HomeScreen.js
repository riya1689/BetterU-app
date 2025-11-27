
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';
// Components
import FeatureCard from '../../components/specific/FeatureCard';
import AppHeader from '../../components/specific/AppHeader';
import ExpertCard from '../../components/specific/ExpertCard';
import AIChatBanner from '../../components/specific/AIChatBanner';
import MoodTrackerBanner from '../../components/specific/MoodTrackerBanner';

// --- PRODUCTION API URL ---
const API_URL = 'https://betteru-backend.onrender.com'; 

// --- LOCAL IMAGE MAPPING ---
// This maps doctor names (from DB) to local assets. 
// Keys must match the 'name' field in your MongoDB exactly, or use IDs.
const LOCAL_IMAGES = {
    'Dr. Mizanur Rahman': require('../../assets/images/dr-mizanur-rahman-Picsart-AiImageEnhancer.png'),
    'Dr. Md. Imran Hossain': require('../../assets/images/dr-md-imran-hossain.png'),
    'Dr. Poly Bhoumik': require('../../assets/images/dr-poly-bhoumik.png'),
    'Dr. Nushrat Jahan Sarker': require('../../assets/images/dr-nushrat-jahan-sarker-Picsart-AiImageEnhancer.png'),
    // Add more mappings here as needed
};

// Helper to safely get image source
const getDoctorImage = (doctor) => {
    // 1. Check if we have a local mapping for this doctor's name
    if (LOCAL_IMAGES[doctor.name]) {
        return LOCAL_IMAGES[doctor.name];
    }
    // 2. If DB has a valid URL, use it (optional, assuming ExpertCard handles {uri})
    if (doctor.image && typeof doctor.image === 'string' && doctor.image.startsWith('http')) {
        return { uri: doctor.image };
    }
    // 3. Fallback placeholder
    return { uri: 'https://placehold.co/150x150/png?text=Doctor' };
};

// --- FALLBACK DATA (Used if API fails) ---
const FALLBACK_EXPERTS = [
    { 
      _id: '1', 
      name: 'Dr. Mizanur Rahman', 
      specialization: 'Psychiatrist', 
      image: require('../../assets/images/dr-mizanur-rahman-Picsart-AiImageEnhancer.png') 
    },
    { 
      _id: '2', 
      name: 'Dr. Md. Imran Hossain', 
      specialization: 'Clinical Psychologist',
      image: require('../../assets/images/dr-md-imran-hossain.png') 
    },
    { 
      _id: '3', 
      name: 'Dr. Poly Bhoumik', 
      specialization: 'Child Psychologist', 
      image: require('../../assets/images/dr-poly-bhoumik.png') 
    },
    {
      _id: '4',
      name: 'Dr. Nushrat Jahan Sarker',
      specialization: 'Psychotherapist',
      image: require('../../assets/images/dr-nushrat-jahan-sarker-Picsart-AiImageEnhancer.png')
    }
];

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return 'Good Morning';
  else if (currentHour < 18) return 'Good Afternoon';
  else return 'Good Evening';
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const themedStyles = styles(theme);

  const greeting = getGreeting();
  const displayName = user ? user.name.split(' ')[0] : 'There';

  // --- STATE ---
  const [experts, setExperts] = useState([]); 
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- 1. Fetch Notifications ---
  const fetchUnreadCount = async () => {
    try {
      let token = user?.token;
      if (!token) token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setUnreadCount(data.count);
    } catch (error) {
      // Silent fail for notifications
    }
  };

  // --- 2. Fetch Doctors ---
  const fetchExperts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors/public`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
            // Map the DB data to include local images
            const mappedData = data.map(doc => ({
                ...doc,
                // OVERRIDE the DB image with our local image if a match exists
                image: getDoctorImage(doc) 
            }));
            setExperts(mappedData);
        } else {
            setExperts(FALLBACK_EXPERTS);
        }
      } else {
        setExperts(FALLBACK_EXPERTS);
      }
    } catch (error) {
      console.log("Using Fallback Experts due to error");
      setExperts(FALLBACK_EXPERTS);
    } finally {
      setLoadingExperts(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
      fetchExperts(); 
    }, [])
  );

  const handlePress = (screenName) => {
    if (screenName) navigation.navigate(screenName);
    else console.log('Feature coming soon!');
  };

  const handleExpertPress = (expert) => {
      console.log('Selected expert:', expert.name);
  }

  return (
    <SafeAreaView style={[themedStyles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader unreadCount={unreadCount} onNotificationPress={() => navigation.navigate('Notifications')} />
      
      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        <Text style={[themedStyles.greeting, { color: theme.primary }]}>{greeting}, {displayName}</Text>
        <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>How are you feeling today?</Text>

        <MoodTrackerBanner />
        
        {/* --- EXPERTS SECTION --- */}
        <View style={themedStyles.sliderSection}>
            <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Available Experts for you</Text>
            
            {loadingExperts ? (
                <ActivityIndicator size="small" color={theme.primary} style={{marginLeft: 20, alignSelf:'flex-start'}} />
            ) : (
                <FlatList
                    data={experts}
                    keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ExpertCard 
                            expert={item}
                            onPress={() => handleExpertPress(item)}
                        />
                    )}
                    contentContainerStyle={{ paddingLeft: 20 }}
                    ListEmptyComponent={
                        <Text style={{marginLeft:20, color: theme.secondaryText}}>
                            No experts available right now.
                        </Text>
                    }
                />
            )}
        </View>
        
        <AIChatBanner />
        
        <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>BetterU Care Toolkit</Text>
        <View style={themedStyles.featureGrid}>
          {/* USING LOCAL IMAGES (Must exist in frontend/assets/images/) */}
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU-mood-tracker.png')} 
            title="Mood Tracker" 
            onPress={() => handlePress('MoodTracker')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU_booking_session-removebg-preview.png')} 
            title="Book a Session" 
            onPress={() => handlePress('Counseling')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU_AI_chat-removebg-preview.png')} 
            title="AI Assistant" 
            onPress={() => handlePress('AI Chat')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU-meditation-boy-girl.png')} 
            title="Meditation" 
            onPress={() => handlePress('Meditate')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/BetterU_self_Assesment.png')} 
            title="Self-Assess" 
            onPress={() => handlePress('Assess')} 
          />
          <FeatureCard 
            imageSource={require('../../assets/images/HiringDoctor.jpg')} 
            title="Join as Doctor" 
            onPress={() => handlePress('JobBoard')} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {},
  greeting: { fontSize: 28, fontWeight: 'bold', marginTop: 20, paddingHorizontal: 20 },
  subHeader: { fontSize: 18, marginBottom: 20, paddingHorizontal: 20 },
  sliderSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 20 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
});

export default HomeScreen;



// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../store/AuthContext';
// import { useTheme } from '../../store/ThemeContext';
// // Components
// import FeatureCard from '../../components/specific/FeatureCard';
// import AppHeader from '../../components/specific/AppHeader';
// import ExpertCard from '../../components/specific/ExpertCard';
// import AIChatBanner from '../../components/specific/AIChatBanner';
// import MoodTrackerBanner from '../../components/specific/MoodTrackerBanner';

// // --- PRODUCTION API URL ---
// const API_URL = 'https://betteru-backend.onrender.com'; 

// const getGreeting = () => {
//   const currentHour = new Date().getHours();
//   if (currentHour < 12) return 'Good Morning';
//   else if (currentHour < 18) return 'Good Afternoon';
//   else return 'Good Evening';
// };

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const { user } = useAuth();
//   const { theme } = useTheme();
//   const themedStyles = styles(theme);

//   const greeting = getGreeting();
//   const displayName = user ? user.name.split(' ')[0] : 'There';

//   // --- STATE ---
//   const [experts, setExperts] = useState([]); 
//   const [loadingExperts, setLoadingExperts] = useState(true);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // --- 1. Fetch Notifications ---
//   const fetchUnreadCount = async () => {
//     try {
//       let token = user?.token;
//       if (!token) token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (response.ok) setUnreadCount(data.count);
//     } catch (error) {
//       console.log("Notification Fetch Error:", error);
//     }
//   };

//   // --- 2. Fetch Doctors (Real Data from MongoDB) ---
//   const fetchExperts = async () => {
//     try {
//       // Note: If this fails with JSON error, it means Backend needs deployment
//       const response = await fetch(`${API_URL}/api/doctors/public`);
      
//       // Check if response is actually JSON before parsing
//       const contentType = response.headers.get("content-type");
//       if (contentType && contentType.indexOf("application/json") !== -1) {
//         const data = await response.json();
//         if (response.ok) setExperts(data);
//       } else {
//         console.log("Backend not ready yet (Returning HTML/404)");
//       }
//     } catch (error) {
//       console.error("Expert Fetch Error:", error);
//     } finally {
//       setLoadingExperts(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchUnreadCount();
//       fetchExperts(); 
//     }, [])
//   );

//   const handlePress = (screenName) => {
//     if (screenName) navigation.navigate(screenName);
//     else console.log('Feature coming soon!');
//   };

//   const handleExpertPress = (expert) => {
//       console.log('Selected expert:', expert.name);
//   }

//   return (
//     <SafeAreaView style={[themedStyles.safeArea, { backgroundColor: theme.background }]}>
//       <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
//       <AppHeader unreadCount={unreadCount} onNotificationPress={() => navigation.navigate('Notifications')} />
      
//       <ScrollView contentContainerStyle={themedStyles.scrollContent}>
//         <Text style={[themedStyles.greeting, { color: theme.primary }]}>{greeting}, {displayName}</Text>
//         <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>How are you feeling today?</Text>

//         <MoodTrackerBanner />
        
//         {/* --- EXPERTS SECTION (REAL DATA) --- */}
//         <View style={themedStyles.sliderSection}>
//             <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Available Experts for you</Text>
            
//             {loadingExperts ? (
//                 <ActivityIndicator size="small" color={theme.primary} style={{marginLeft: 20, alignSelf:'flex-start'}} />
//             ) : (
//                 <FlatList
//                     data={experts}
//                     keyExtractor={(item) => item._id}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     renderItem={({ item }) => (
//                         <ExpertCard 
//                             expert={item}
//                             onPress={() => handleExpertPress(item)}
//                         />
//                     )}
//                     contentContainerStyle={{ paddingLeft: 20 }}
//                     ListEmptyComponent={
//                         <Text style={{marginLeft:20, color: theme.secondaryText}}>
//                             {/* If list is empty, it means backend didn't return data yet */}
//                             No experts available right now.
//                         </Text>
//                     }
//                 />
//             )}
//         </View>
        
//         <AIChatBanner />
        
//         <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>BetterU Care Toolkit</Text>
//         <View style={themedStyles.featureGrid}>
//           {/* RESTORED LOCAL IMAGES */}
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU-mood-tracker.png')} 
//             title="Mood Tracker" 
//             onPress={() => handlePress('MoodTracker')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU_booking_session-removebg-preview.png')} 
//             title="Book a Session" 
//             onPress={() => handlePress('Counseling')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU_AI_chat-removebg-preview.png')} 
//             title="AI Assistant" 
//             onPress={() => handlePress('AI Chat')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU-meditation-boy-girl.png')} 
//             title="Meditation" 
//             onPress={() => handlePress('Meditate')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU_self_Assesment.png')} 
//             title="Self-Assess" 
//             onPress={() => handlePress('Assess')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/HiringDoctor.jpg')} 
//             title="Join as Doctor" 
//             onPress={() => handlePress('JobBoard')} 
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = (theme) => StyleSheet.create({
//   safeArea: { flex: 1 },
//   scrollContent: {},
//   greeting: { fontSize: 28, fontWeight: 'bold', marginTop: 20, paddingHorizontal: 20 },
//   subHeader: { fontSize: 18, marginBottom: 20, paddingHorizontal: 20 },
//   sliderSection: { marginBottom: 30 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 20 },
//   featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
// });

// export default HomeScreen;




// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../store/AuthContext';
// import { useTheme } from '../../store/ThemeContext';
// // Components
// import FeatureCard from '../../components/specific/FeatureCard';
// import AppHeader from '../../components/specific/AppHeader';
// import ExpertCard from '../../components/specific/ExpertCard';
// import AIChatBanner from '../../components/specific/AIChatBanner';
// import MoodTrackerBanner from '../../components/specific/MoodTrackerBanner';

// // --- PRODUCTION API URL ---
// // Change this to your actual Render URL
// const API_URL = 'https://betteru-backend.onrender.com'; 

// const getGreeting = () => {
//   const currentHour = new Date().getHours();
//   if (currentHour < 12) return 'Good Morning';
//   else if (currentHour < 18) return 'Good Afternoon';
//   else return 'Good Evening';
// };

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const { user } = useAuth();
//   const { theme } = useTheme();
//   const themedStyles = styles(theme);

//   const greeting = getGreeting();
//   const displayName = user ? user.name.split(' ')[0] : 'There';

//   // --- STATE ---
//   const [experts, setExperts] = useState([]); // Store Real Data
//   const [loadingExperts, setLoadingExperts] = useState(true);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // --- 1. Fetch Notifications ---
//   const fetchUnreadCount = async () => {
//     try {
//       let token = user?.token;
//       if (!token) token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (response.ok) setUnreadCount(data.count);
//     } catch (error) {
//       console.log("Notification Fetch Error:", error);
//     }
//   };

//   // --- 2. Fetch Doctors (Real Data from MongoDB) ---
//   const fetchExperts = async () => {
//     try {
//       // Use the public endpoint we created
//       const response = await fetch(`${API_URL}/api/doctors/public`);
//       const data = await response.json();
//       if (response.ok) {
//         setExperts(data);
//       }
//     } catch (error) {
//       console.error("Expert Fetch Error:", error);
//     } finally {
//       setLoadingExperts(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchUnreadCount();
//       fetchExperts(); 
//     }, [])
//   );

//   const handlePress = (screenName) => {
//     if (screenName) navigation.navigate(screenName);
//     else console.log('Feature coming soon!');
//   };

//   const handleExpertPress = (expert) => {
//       console.log('Selected expert:', expert.name);
//       // You can navigate to a detail screen here if you have one
//   }

//   return (
//     <SafeAreaView style={[themedStyles.safeArea, { backgroundColor: theme.background }]}>
//       <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
//       <AppHeader unreadCount={unreadCount} onNotificationPress={() => navigation.navigate('Notifications')} />
      
//       <ScrollView contentContainerStyle={themedStyles.scrollContent}>
//         <Text style={[themedStyles.greeting, { color: theme.primary }]}>{greeting}, {displayName}</Text>
//         <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>How are you feeling today?</Text>

//         <MoodTrackerBanner />
        
//         {/* --- EXPERTS SECTION (REAL DATA) --- */}
//         <View style={themedStyles.sliderSection}>
//             <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Available Experts for you</Text>
            
//             {loadingExperts ? (
//                 <ActivityIndicator size="small" color={theme.primary} style={{marginLeft: 20, alignSelf:'flex-start'}} />
//             ) : (
//                 <FlatList
//                     data={experts}
//                     keyExtractor={(item) => item._id}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     renderItem={({ item }) => (
//                         <ExpertCard 
//                             expert={item}
//                             onPress={() => handleExpertPress(item)}
//                         />
//                     )}
//                     contentContainerStyle={{ paddingLeft: 20 }}
//                     ListEmptyComponent={
//                         <Text style={{marginLeft:20, color: theme.secondaryText}}>
//                             No experts available right now.
//                         </Text>
//                     }
//                 />
//             )}
//         </View>
        
//         <AIChatBanner />
        
//         <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>BetterU Care Toolkit</Text>
//         <View style={themedStyles.featureGrid}>
//           {/* SAFE MODE: Used online images to prevent build crashes due to missing local assets */}
//           <FeatureCard 
//             imageSource={{ uri: 'https://placehold.co/200x200/png?text=Mood' }} 
//             title="Mood Tracker" 
//             onPress={() => handlePress('MoodTracker')} 
//           />
//           <FeatureCard 
//             imageSource={{ uri: 'https://placehold.co/200x200/png?text=Session' }} 
//             title="Book a Session" 
//             onPress={() => handlePress('Counseling')} 
//           />
//           <FeatureCard 
//             imageSource={{ uri: 'https://placehold.co/200x200/png?text=AI+Chat' }} 
//             title="AI Assistant" 
//             onPress={() => handlePress('AI Chat')} 
//           />
//           <FeatureCard 
//             imageSource={{ uri: 'https://placehold.co/200x200/png?text=Meditate' }} 
//             title="Meditation" 
//             onPress={() => handlePress('Meditate')} 
//           />
//           <FeatureCard 
//             imageSource={{ uri: 'https://placehold.co/200x200/png?text=Assess' }} 
//             title="Self-Assess" 
//             onPress={() => handlePress('Assess')} 
//           />
//           <FeatureCard 
//             imageSource={{ uri: 'https://placehold.co/200x200/png?text=Join+Us' }} 
//             title="Join as Doctor" 
//             onPress={() => handlePress('JobBoard')} 
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = (theme) => StyleSheet.create({
//   safeArea: { flex: 1 },
//   scrollContent: {},
//   greeting: { fontSize: 28, fontWeight: 'bold', marginTop: 20, paddingHorizontal: 20 },
//   subHeader: { fontSize: 18, marginBottom: 20, paddingHorizontal: 20 },
//   sliderSection: { marginBottom: 30 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 20 },
//   featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
// });

// export default HomeScreen;



// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, FlatList } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../store/AuthContext';
// import { useTheme } from '../../store/ThemeContext';
// import FeatureCard from '../../components/specific/FeatureCard';
// import AppHeader from '../../components/specific/AppHeader';
// import ExpertCard from '../../components/specific/ExpertCard';
// import AIChatBanner from '../../components/specific/AIChatBanner'; // 1. Import the new banner
// import MoodTrackerBanner from '../../components/specific/MoodTrackerBanner';
// // --- UPDATE: Using a local image for the first expert ---
// const MOCK_EXPERTS = [
//     { 
//       id: '1', 
//       name: 'Dr. Mizanur Rahman', 
//       specialization: 'Psychiatrist', 
//       // This now uses require() to load the local image
//       image: require('../../assets/images/dr-mizanur-rahman-Picsart-AiImageEnhancer.png') 
//     },
//     { id: '2', name: 'Dr. Md. Imran Hossain', specialization: 'Clinical Psychologist',
//       image: require('../../assets/images/dr-md-imran-hossain.png') },
//     { id: '3', name: 'Dr. Poly Bhoumik', specialization: 'Child Psychologist', 
//       image: require('../../assets/images/dr-poly-bhoumik.png') },
//     { id: '4', name: 'Dr. Nusrhat Jahan Sarker', specialization: 'Psychotherapist', 
//       image: require('../../assets/images/dr-nushrat-jahan-sarker-Picsart-AiImageEnhancer.png') }
// ];
// // ---------------------------------------------------------

// const getGreeting = () => {
//   const currentHour = new Date().getHours();
//   if (currentHour < 12) {
//     return 'Good Morning';
//   } else if (currentHour < 18) {
//     return 'Good Afternoon';
//   } else {
//     return 'Good Evening';
//   }
// };

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const { user } = useAuth();
//   const { theme } = useTheme();

//   const greeting = getGreeting();
//   const displayName = user ? user.name.split(' ')[0] : 'There';

//   // --- NOTIFICATION LOGIC ---
//   const [unreadCount, setUnreadCount] = useState(0);

//   const fetchUnreadCount = async () => {
//     try {
//       let token = user?.token;
//       if (!token) token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const response = await fetch('http://10.0.2.2:5000/api/notifications/unread-count', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (response.ok) setUnreadCount(data.count);
//     } catch (error) {
//       console.log("Home Notification Error:", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchUnreadCount();
//     }, [])
//   );

//  //-------------
//   const handlePress = (screenName) => {
//     if (screenName) {
//       navigation.navigate(screenName);
//     } else {
//       console.log('Feature coming soon!');
//     }
//   };

//   const handleExpertPress = (expert) => {
//       console.log('Selected expert:', expert.name);
//   }

//   const themedStyles = styles(theme);

//   return (
//     <SafeAreaView style={[themedStyles.safeArea, { backgroundColor: theme.background }]}>
//       <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} />
//       <AppHeader unreadCount={unreadCount} onNotificationPress={() => navigation.navigate('Notifications')} />
      
//       <ScrollView contentContainerStyle={themedStyles.scrollContent}>
//         <Text style={[themedStyles.greeting, { color: theme.primary }]}>{greeting}, {displayName}</Text>
//         <Text style={[themedStyles.subHeader, { color: theme.secondaryText }]}>How are you feeling today?</Text>

//       <MoodTrackerBanner />

        
//         <View style={themedStyles.sliderSection}>
//             <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>Available Experts for you</Text>
//             <FlatList
//                 data={MOCK_EXPERTS}
//                 keyExtractor={(item) => item.id}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 renderItem={({ item }) => (
//                     <ExpertCard 
//                         expert={item}
//                         onPress={() => handleExpertPress(item)}
//                     />
//                 )}
//                 contentContainerStyle={{ paddingLeft: 20 }}
//             />
//         </View>
//          {/* --- 2. Add the new AI Chat Banner here --- */}
//         <AIChatBanner />
//         {/* --- UPDATED FEATURE CARD SECTION --- */}
//         <Text style={[themedStyles.sectionTitle, { color: theme.text }]}>BetterU Care Toolkit</Text>
//         <View style={themedStyles.featureGrid}>


//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU-mood-tracker.png')} 
//             title="Mood Tracker" 
//             onPress={() => handlePress('MoodTracker')} 
//           />

//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU_booking_session-removebg-preview.png')}
//             title="Book a Session" 
//             onPress={() => handlePress('Counseling')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU_AI_chat-removebg-preview.png')}
//             title="AI Assistant" 
//             onPress={() => handlePress('AI Chat')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU-meditation-boy-girl.png')}
//             title="Meditation" 
//             onPress={() => handlePress('Meditate')} 
//           />
//           <FeatureCard 
//             imageSource={require('../../assets/images/BetterU_self_Assesment.png')}
//             title="Self-Assess" 
//             onPress={() => handlePress('Assess')}
//           />
//           {/* ----------- Join as Doctor ------------- */}

//           <FeatureCard 
//             imageSource={require('../../assets/images/HiringDoctor.jpg')} // Placeholder image
//             title="Join as Doctor" 
//             onPress={() => handlePress('JobBoard')} 
//           />
//         </View>
//         {/* ------------------------------------ */}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = (theme) => StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   scrollContent: {},
//   greeting: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   subHeader: {
//     fontSize: 18,
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   sliderSection: {
//       marginBottom: 30,
//   },
//   sectionTitle: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 15,
//       paddingHorizontal: 20,
//   },
//   featureGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//   },
// });

// export default HomeScreen;
