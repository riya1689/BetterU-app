import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

const ToastMessage = ({ message, visible, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // If the message should be visible...
    if (visible) {
      // ...fade it in...
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // ...then wait 3 seconds...
        setTimeout(() => {
          // ...and fade it out.
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            // Let the parent component know it's hidden
            if (onHide) {
              onHide();
            }
          });
        }, 3000); // 3000 milliseconds = 3 seconds
      });
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Position it above the tab bar
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1000, // Make sure it's on top of everything
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default ToastMessage;
