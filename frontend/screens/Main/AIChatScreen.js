import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AuthGuard from '../../components/specific/AuthGuard';
import { useTheme } from '../../store/ThemeContext';
import apiClient from '../../services/apiClient'; // Import our API client

const AIChatScreen = () => {
  // Start with only the initial AI message
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I am BetterU\'s AI assistant. Feel free to share what\'s on your mind. I\'m here to listen.',
      sender: 'ai',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To show a loading indicator for AI replies
  const { theme } = useTheme();
  const flatListRef = useRef();

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    // Add user's message and show a loading indicator
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // --- REAL API CALL ---
    try {
      // Prepare the chat history for the Gemini API
      // It needs a specific format: { role: 'user'/'model', parts: [{ text: '...' }] }
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      // Call our backend's /api/ai/chat endpoint
      const response = await apiClient.post('/api/ai/chat', {
        userMessage: userMessage.text,
        history: history,
      });

      const aiReply = {
        id: Date.now().toString() + 'ai',
        text: response.data.reply,
        sender: 'ai',
      };
      
      // Add the AI's reply to the chat
      setMessages(prev => [...prev, aiReply]);

    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorReply = {
        id: Date.now().toString() + 'err',
        text: 'Sorry, I\'m having trouble connecting. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsLoading(false); // Hide the loading indicator
    }
  };

  const themedStyles = styles(theme);

  return (
    <AuthGuard>
      <KeyboardAvoidingView 
        style={[themedStyles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[
              themedStyles.messageBubble,
              item.sender === 'user' ? [themedStyles.userBubble, { backgroundColor: theme.primary }] : [themedStyles.aiBubble, { backgroundColor: theme.card }]
            ]}>
              <Text style={item.sender === 'user' ? themedStyles.userText : [themedStyles.aiText, { color: theme.text }]}>
                {item.text}
              </Text>
            </View>
          )}
          style={themedStyles.chatContainer}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
        {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} color={theme.primary} />}
        <View style={[themedStyles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            style={[themedStyles.input, { backgroundColor: theme.background, color: theme.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={theme.secondaryText}
            editable={!isLoading} // Disable input while AI is thinking
          />
          <TouchableOpacity style={[themedStyles.sendButton, { backgroundColor: theme.primary }]} onPress={handleSend} disabled={isLoading}>
            <Text style={themedStyles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AuthGuard>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
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
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userText: {
    color: '#ffffff',
    fontSize: 16,
  },
  aiText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
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
