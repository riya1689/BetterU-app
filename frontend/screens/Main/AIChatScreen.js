import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

// MOCK DATA: Sample chat messages
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Hello! I am BetterU\'s AI assistant. Feel free to share what\'s on your mind. I\'m here to listen.',
    sender: 'ai',
  },
  {
    id: '2',
    text: 'I\'ve been feeling really anxious lately.',
    sender: 'user',
  },
  {
    id: '3',
    text: 'I understand. It takes courage to share that. Could you tell me a bit more about what this anxiety feels like?',
    sender: 'ai',
  },
];

const AIChatScreen = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user's message to the chat
    const newUserMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');

    // In a real app, you would send the message to your OpenAI backend here
    // and then add the AI's response.
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.aiBubble
          ]}>
            <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>
              {item.text}
            </Text>
          </View>
        )}
        style={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#1e3a8a',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userText: {
    color: '#ffffff',
    fontSize: 16,
  },
  aiText: {
    color: '#1f2937',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff'
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 25,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AIChatScreen;
