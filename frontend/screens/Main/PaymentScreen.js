import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  // const { paymentUrl } = route.params; // In a real app, the backend would provide this URL

  // For demonstration, we will use a placeholder URL.
  // Replace this with the actual AmarPay URL when you integrate the backend.
  const MOCK_PAYMENT_URL = 'https://aamarpay.com/';

  const themedStyles = styles(theme);

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      {/* --- Custom Header --- */}
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Complete Payment</Text>
        <View style={{ width: 28 }} /> 
      </View>

      {/* --- WebView for AmarPay --- */}
      <WebView 
        source={{ uri: MOCK_PAYMENT_URL }} 
        style={{ flex: 1 }}
        // This is important to show a loading indicator
        startInLoadingState={true}
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
