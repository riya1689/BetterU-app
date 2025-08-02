import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert } from 'react-native';
import AuthGuard from '../../components/specific/AuthGuard';
import { useTheme } from '../../store/ThemeContext';
import apiClient from '../../services/apiClient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Markdown from 'react-native-markdown-display'; // We'll use this to render the AI's formatted response

const AIChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I am BetterU\'s AI assistant. Feel free to share what\'s on your mind. You can also upload a medical report for analysis using the + icon.',
      sender: 'ai',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { theme } = useTheme();
  const flatListRef = useRef();

  const handleUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload a report.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 1,
    });
    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  const handleSend = async () => {
    if ((inputText.trim() === '' && !selectedImage) || isLoading) return;

    const userMessageText = inputText;
    const userImageUri = selectedImage;

    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      imageUri: userImageUri, // Include image URI for display
    };
    
    // Immediately update UI
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let aiReplyText;

      // --- LOGIC TO DECIDE WHICH API TO CALL ---
      if (userImageUri) {
        // --- IMAGE UPLOAD FLOW ---
        const formData = new FormData();
        formData.append('reportImage', {
          uri: userImageUri,
          name: `report-${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
        
        // You can also send the text along with the image if needed
        formData.append('text', userMessageText);

        const response = await apiClient.post('/api/ai/analyze-report', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        aiReplyText = response.data.reply;

      } else {
        // --- TEXT-ONLY CHAT FLOW ---
        const history = [...messages, userMessage].map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }));

        const response = await apiClient.post('/api/ai/chat', {
          userMessage: userMessageText,
          history: history,
        });
        aiReplyText = response.data.reply;
      }

      const aiReply = {
        id: Date.now().toString() + 'ai',
        text: aiReplyText,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiReply]);

    } catch (error) {
      console.error('Failed to get AI response:', error.response?.data || error.message);
      const errorReply = {
        id: Date.now().toString() + 'err',
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
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
              {/* --- NEW: Show image if it exists on the message --- */}
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={themedStyles.messageImage} />
              )}
              {/* Use Markdown to render AI responses */}
              {item.sender === 'ai' ? (
                <Markdown style={{body: {color: theme.text, fontSize: 16}}}>{item.text}</Markdown>
              ) : (
                <Text style={themedStyles.userText}>{item.text}</Text>
              )}
            </View>
          )}
          style={themedStyles.chatContainer}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
        {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} color={theme.primary} />}
        
        {selectedImage && (
          <View style={themedStyles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={themedStyles.previewImage} />
            <TouchableOpacity onPress={() => setSelectedImage(null)} style={themedStyles.removeImageButton}>
              <Ionicons name="close-circle" size={24} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        )}

        <View style={[themedStyles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={themedStyles.uploadButton} onPress={handleUpload} disabled={isLoading}>
            <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
          </TouchableOpacity>
          <TextInput
            style={[themedStyles.input, { backgroundColor: theme.background, color: theme.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type or upload a report..."
            placeholderTextColor={theme.secondaryText}
            editable={!isLoading}
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
  container: { flex: 1 },
  chatContainer: { flex: 1, padding: 10 },
  messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  userText: { color: '#ffffff', fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, alignItems: 'center' },
  uploadButton: { padding: 5, marginRight: 5 },
  input: { flex: 1, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, marginRight: 10 },
  sendButton: { paddingHorizontal: 20, paddingVertical: 12, justifyContent: 'center', borderRadius: 25 },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  previewContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10, backgroundColor: theme.card },
  previewImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  removeImageButton: { position: 'absolute', top: 5, left: 60 },
  // --- NEW STYLE for images inside the chat message ---
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
});

export default AIChatScreen;