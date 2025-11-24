import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  FlatList, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';

const AdminJobManagerScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // --- State for Tabs ---
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'list'

  // --- State for Form (Create Job) ---
  const [title, setTitle] = useState('');
  const [designation, setDesignation] = useState('');
  const [requirements, setRequirements] = useState(''); // Comma separated string
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [deadline, setDeadline] = useState(''); // Format: YYYY-MM-DD
  const [submitting, setSubmitting] = useState(false);

  // --- State for List (Manage Jobs) ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. Fetch Jobs (For List View) ---
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Use your actual local IP
      const response = await fetch('http://10.0.2.2:5000/api/jobs/active'); 
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Create Job Function ---
  const handleCreateJob = async () => {
    if (!title || !designation || !requirements || !description || !deadline) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Convert comma-separated requirements into an Array
      const reqArray = requirements.split(',').map(item => item.trim());

      const payload = {
        title,
        designation,
        requirements: reqArray,
        description,
        salaryRange,
        deadline // Ensure text is YYYY-MM-DD
      };

      // POST request to Admin Route
      const response = await fetch('http://10.0.2.2:5000/api/admin/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'x-auth-token': adminToken // Add this if you have auth middleware enabled!
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Job Posted Successfully!");
        // Reset Form
        setTitle('');
        setDesignation('');
        setRequirements('');
        setDescription('');
        setSalaryRange('');
        setDeadline('');
        // Switch to list to see it
        fetchJobs(); 
      } else {
        Alert.alert("Error", data.message || "Failed to post job");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 3. Delete Job Function ---
  const handleDeleteJob = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this job opening?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: 'destructive',
          onPress: async () => {
            try {
              // NOTE: We need to ensure backend has DELETE /api/admin/job/:id
              // If you haven't added deleteJob in backend yet, this will fail.
              const response = await fetch(`http://10.0.2.2:5000/api/admin/job/${id}`, {
                method: 'DELETE',
              });
              
              if (response.ok) {
                Alert.alert("Deleted", "Job removed successfully.");
                fetchJobs(); // Refresh list
              } else {
                Alert.alert("Error", "Could not delete job.");
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (activeTab === 'list') {
      fetchJobs();
    }
  }, [activeTab]);

  // --- Render Functions ---

  const renderCreateForm = () => (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.label}>Job Title *</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Consultant Psychiatrist" 
        placeholderTextColor="#999"
        value={title} onChangeText={setTitle} 
      />

      <Text style={styles.label}>Designation *</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Senior Consultant" 
        placeholderTextColor="#999"
        value={designation} onChangeText={setDesignation} 
      />

      <Text style={styles.label}>Salary Range</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. 50k - 80k or Negotiable" 
        placeholderTextColor="#999"
        value={salaryRange} onChangeText={setSalaryRange} 
      />

      <Text style={styles.label}>Deadline (YYYY-MM-DD) *</Text>
      <TextInput 
        style={styles.input} 
        placeholder="2025-12-31" 
        placeholderTextColor="#999"
        value={deadline} onChangeText={setDeadline} 
      />

      <Text style={styles.label}>Requirements (comma separated) *</Text>
      <TextInput 
        style={styles.input} 
        placeholder="MBBS, 3 Years Experience, FCPS" 
        placeholderTextColor="#999"
        value={requirements} onChangeText={setRequirements} 
      />

      <Text style={styles.label}>Job Description *</Text>
      <TextInput 
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
        placeholder="Enter full job details..." 
        placeholderTextColor="#999"
        multiline
        value={description} onChangeText={setDescription} 
      />

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleCreateJob}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Post Job Circular</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderJobList = () => (
    <View style={styles.listContainer}>
      {loading ? <ActivityIndicator size="large" color={theme.primary} /> : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No Active Jobs Found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobCardTitle}>{item.title}</Text>
                <Text style={styles.jobCardSub}>{item.designation}</Text>
                <Text style={styles.jobCardDate}>Deadline: {new Date(item.deadline).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteJob(item._id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Manager</Text>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'create' && styles.activeTab]} 
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>Post Job</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'list' && styles.activeTab]} 
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>All Jobs</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1 }}>
        {activeTab === 'create' ? renderCreateForm() : renderJobList()}
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: theme.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.secondaryText,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.primary,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  label: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.inputBackground,
    color: theme.text,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  submitButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  jobCard: {
    backgroundColor: theme.cardBackground,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  jobCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  jobCardSub: {
    fontSize: 14,
    color: theme.primary,
  },
  jobCardDate: {
    fontSize: 12,
    color: theme.secondaryText,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: theme.secondaryText,
  }
});

export default AdminJobManagerScreen;