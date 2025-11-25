import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';

const JobApplicationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth(); // To auto-fill name/email if available
  const { jobId, jobTitle } = route.params; // Get Job Info passed from previous screen

  const styles = getStyles(theme);

  // --- Form States ---
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  
  const [specialization, setSpecialization] = useState('');
  const [medicalDegree, setMedicalDegree] = useState('');
  const [institute, setInstitute] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [experience, setExperience] = useState('');

  const [cvUrl, setCvUrl] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [socialLink, setSocialLink] = useState('');

  const [bkashNumber, setBkashNumber] = useState('');
  const [nidNumber, setNidNumber] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if(!fullName || !email || !phone || !cvUrl || !profileImageUrl || !bkashNumber) {
      Alert.alert("Missing Info", "Please fill in all required fields (Name, Email, Phone, CV Link, Photo Link, Bkash).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        jobId,
        fullName,
        email,
        phone,
        age,
        specialization,
        medicalDegree,
        institute,
        passingYear,
        experience,
        portfolio,
        socialLink,
        bkashNumber,
        nidNumber,
        cvUrl,
        profileImageUrl
      };

      // POST to Backend
      const response = await fetch('http://10.0.2.2:5000/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Assuming you store token in AuthContext
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Application Submitted! Admin will review it shortly.", [
            { text: "OK", onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert("Error", data.message || "Submission failed");
      }

    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply: {jobTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Personal Info</Text>
        <TextInput style={styles.input} placeholder="Full Name *" placeholderTextColor="#888" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Phone Number *" placeholderTextColor="#888" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Age *" placeholderTextColor="#888" value={age} onChangeText={setAge} keyboardType="numeric" />

        <Text style={styles.sectionHeader}>Professional Info</Text>
        <TextInput style={styles.input} placeholder="Specialization (e.g. Cardiologist) *" placeholderTextColor="#888" value={specialization} onChangeText={setSpecialization} />
        <TextInput style={styles.input} placeholder="Degree (e.g. MBBS, FCPS) *" placeholderTextColor="#888" value={medicalDegree} onChangeText={setMedicalDegree} />
        <TextInput style={styles.input} placeholder="Medical Institute *" placeholderTextColor="#888" value={institute} onChangeText={setInstitute} />
        <TextInput style={styles.input} placeholder="Passing Year *" placeholderTextColor="#888" value={passingYear} onChangeText={setPassingYear} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Years of Experience *" placeholderTextColor="#888" value={experience} onChangeText={setExperience} />

        <Text style={styles.sectionHeader}>Documents & Links</Text>
        <Text style={styles.hint}>Paste public links (Google Drive/Dropbox)</Text>
        <TextInput style={styles.input} placeholder="Profile Picture Link (JPG/PNG) *" placeholderTextColor="#888" value={profileImageUrl} onChangeText={setProfileImageUrl} />
        <TextInput style={styles.input} placeholder="CV / Resume Link *" placeholderTextColor="#888" value={cvUrl} onChangeText={setCvUrl} />
        <TextInput style={styles.input} placeholder="Portfolio Link (Optional)" placeholderTextColor="#888" value={portfolio} onChangeText={setPortfolio} />
        <TextInput style={styles.input} placeholder="Social Profile Link (Optional)" placeholderTextColor="#888" value={socialLink} onChangeText={setSocialLink} />

        <Text style={styles.sectionHeader}>Verification & Payment</Text>
        <TextInput style={styles.input} placeholder="NID Number" placeholderTextColor="#888" value={nidNumber} onChangeText={setNidNumber} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Bkash Number (Personal) *" placeholderTextColor="#888" value={bkashNumber} onChangeText={setBkashNumber} keyboardType="phone-pad" />

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Application</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: theme.border },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text },
  scrollContent: { padding: 20, paddingBottom: 50 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: theme.primary, marginTop: 15, marginBottom: 10 },
  hint: { fontSize: 12, color: theme.secondaryText, marginBottom: 10, fontStyle: 'italic' },
  input: { backgroundColor: theme.inputBackground, color: theme.text, padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
  submitButton: { backgroundColor: 'green', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default JobApplicationScreen;