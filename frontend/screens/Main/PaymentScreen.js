import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants'; // Import Constants

// Get the client URL from your app config
const CLIENT_URL = Constants.expoConfig?.extra?.client_url ?? process.env.EXPO_PUBLIC_CLIENT_URL;


const PaymentScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { paymentUrl } = route.params;

  const themedStyles = styles(theme);

  // This function will be called whenever the URL inside the WebView changes
  const handleNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    if (!url) return;

    // Check if the URL is the success callback
    if (url.includes(`${CLIENT_URL}/payment/success`)) {
      navigation.replace('PaymentStatus', {
        status: 'success',
        message: 'Payment Successful!',
        nextScreen: 'Appointments' // Or whatever your main appointments list screen is called
      });
    }

    // Check if the URL is the fail callback
    if (url.includes(`${CLIENT_URL}/payment/fail`)) {
      navigation.replace('PaymentStatus', {
        status: 'fail',
        message: 'Payment Failed',
        nextScreen: 'Home' // Redirect to Home on failure
      });
    }
    
    // Check if the URL is the cancel callback
    if (url.includes(`${CLIENT_URL}/payment/cancel`)) {
        navigation.replace('PaymentStatus', {
            status: 'fail',
            message: 'Payment Cancelled',
            nextScreen: 'Home' // Redirect to Home on cancellation
        });
    }
  };

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Complete Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <WebView
        source={{ uri: paymentUrl }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        // Add this new prop to listen for URL changes
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;

// import React from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useTheme } from '../../store/ThemeContext';
// import { Ionicons } from '@expo/vector-icons';

// const PaymentScreen = ({ navigation, route }) => {
//   const { theme } = useTheme();

//   // REPLACED: This now gets the real payment URL from the navigation parameters
//   const { paymentUrl } = route.params;

//   const themedStyles = styles(theme);

//   return (
//     <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
//       {/* --- Custom Header --- */}
//       <View style={themedStyles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={28} color={theme.text} />
//         </TouchableOpacity>
//         <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Complete Payment</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       {/* --- WebView for SSL Commerz --- */}
//       <WebView
//         // REPLACED: The source now uses the real paymentUrl
//         source={{ uri: paymentUrl }}
//         style={{ flex: 1 }}
//         startInLoadingState={true}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = (theme) => StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.border,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default PaymentScreen;
