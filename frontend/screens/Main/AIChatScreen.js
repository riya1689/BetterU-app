import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert } from 'react-native';
import AuthGuard from '../../components/specific/AuthGuard';
import { useTheme } from '../../store/ThemeContext';
import apiClient from '../../services/apiClient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Markdown from 'react-native-markdown-display';
import { Audio } from 'expo-av';

// Conditionally require the voice library only on mobile platforms
let Voice;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch (e) {
    console.log("Could not load @react-native-voice/voice. Voice features will be disabled.");
    Voice = null;
  }
}

const AIChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I am BetterU's AI assistant. How can I help you today? You can type, upload a report, or use the microphone to talk.",
      sender: 'ai',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const { theme } = useTheme();
  const flatListRef = useRef();

  // --- FIX: Added a check to ensure 'Voice' is not null before using it ---
  useEffect(() => {
    if (Voice) {
      const onSpeechStart = (e) => setIsListening(true);
      const onSpeechEnd = (e) => setIsListening(false);
      const onSpeechError = (e) => {
        setIsListening(false);
        Alert.alert('Voice Error', e.error?.message || 'Something went wrong.');
      };
      const onSpeechResults = (e) => {
        if (e.value && e.value.length > 0) {
          setInputText(e.value[0]);
        }
      };

      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;

      return () => {
        Voice.destroy().then(Voice.removeAllListeners).catch(e => console.error("Error destroying voice listeners", e));
      };
    }
  }, []);

  const startListening = async () => {
    if (!Voice) return;
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required for the voice feature.');
        return;
      }
      await Voice.start('en-US');
    } catch (e) {
      console.error('Error starting voice recognition:', e);
    }
  };

  const stopListening = async () => {
    if (!Voice) return;
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  };

  const handleVoiceButtonPress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload a report.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    const userMessage = { id: Date.now().toString(), text: userMessageText, sender: 'user', imageUri: userImageUri };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let aiReplyData; // let aiReplyText;
      if (userImageUri) {
        const formData = new FormData();
        formData.append('reportImage', { uri: userImageUri, name: `report-${Date.now()}.jpg`, type: 'image/jpeg' });
        formData.append('text', userMessageText);
        // --- FIX: Corrected URL ---
        const response = await apiClient.post('/ai/analyze-report', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        aiReplyData = response.data.reply;
      } else {
        const history = [...messages, userMessage].map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
        // --- FIX: Corrected URL ---
        const response = await apiClient.post('/ai/chat', { userMessage: userMessageText, history: history });
        aiReplyData = response.data.reply;
      }
      // Check if the reply is an array of messages
      if (Array.isArray(aiReplyData)) {
        // Display each message bubble with a delay
        aiReplyData.forEach((textPart, index) => {
          setTimeout(() => {
            const aiMessagePart = {
              id: `${Date.now().toString()}-ai-${index}`, // Unique ID for each part
              text: textPart,
              sender: 'ai'
            };
            setMessages(prev => [...prev, aiMessagePart]);
          }, 600 * (index + 1)); // Stagger the appearance of each bubble
        });
      } else{
            const aiReply = { id: Date.now().toString() + 'ai', text: aiReplyText, sender: 'ai' };
            setMessages(prev => [...prev, aiReply]);
          }

    } catch (error) {
      console.error('Failed to get AI response:', error.response?.data || error.message);
      const errorReply = { id: Date.now().toString() + 'err', text: 'Sorry, something went wrong. Please try again.', sender: 'ai' };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      // Delay setting isLoading to false until after the last message has had time to appear
      const delay = Array.isArray(aiReplyData) ? 600 * (aiReplyData.length + 1) : 0;
      setTimeout(() => setIsLoading(false), delay);
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
            <View style={[ themedStyles.messageBubble, item.sender === 'user' ? themedStyles.userBubble : themedStyles.aiBubble ]}>
              {item.imageUri && <Image source={{ uri: item.imageUri }} style={themedStyles.messageImage} />}
              {item.sender === 'ai' ? (
                <Markdown style={{body: {color: theme.text, fontSize: 16}}}>{item.text}</Markdown>
              ) : (
                <Text style={themedStyles.userText}>{item.text}</Text>
              )}
            </View>
          )}
          style={themedStyles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
          <TouchableOpacity style={themedStyles.iconButton} onPress={handleUpload} disabled={isLoading}>
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
          
          {inputText.trim().length > 0 ? (
            <TouchableOpacity style={themedStyles.iconButton} onPress={handleSend} disabled={isLoading}>
              <Ionicons name="arrow-up-circle" size={32} color={theme.primary} />
            </TouchableOpacity>
          ) : (
            !Voice ? (
              <TouchableOpacity style={themedStyles.iconButton} disabled={true}>
                <Ionicons name="mic-off-outline" size={28} color={theme.secondaryText} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={themedStyles.iconButton} onPress={handleVoiceButtonPress}>
                <Ionicons name="mic-outline" size={28} color={isListening ? (theme.accent || 'red') : theme.primary} />
              </TouchableOpacity>
            )
          )}
        </View>
      </KeyboardAvoidingView>
    </AuthGuard>
  );
};

const styles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { flex: 1, padding: 10 },
  messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 5, backgroundColor: theme.primary },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 5, backgroundColor: theme.card },
  userText: { color: '#ffffff', fontSize: 16 },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, marginHorizontal: 10 },
  previewContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10, backgroundColor: theme.card },
  previewImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  removeImageButton: { position: 'absolute', top: 5, left: 60 },
  messageImage: { width: 200, height: 200, borderRadius: 15, marginBottom: 10 },
  iconButton: { padding: 5, },
});

export default AIChatScreen;
