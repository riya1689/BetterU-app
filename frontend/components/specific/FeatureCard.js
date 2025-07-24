import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../common/Card'; // We're reusing our Card component!

const FeatureCard = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%', // To fit two cards side-by-side
    marginBottom: 15,
  },
  card: {
    alignItems: 'center', // Center the icon and text
    padding: 15,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    textAlign: 'center',
  },
});

export default FeatureCard;
