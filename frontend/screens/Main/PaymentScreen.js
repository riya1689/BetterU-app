import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../store/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ navigation, route }) => {
  const { theme } = useTheme();

  // REPLACED: This now gets the real payment URL from the navigation parameters
  const { paymentUrl } = route.params;

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

      {/* --- WebView for SSL Commerz --- */}
      <WebView
        // REPLACED: The source now uses the real paymentUrl
        source={{ uri: paymentUrl }}
        style={{ flex: 1 }}
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
