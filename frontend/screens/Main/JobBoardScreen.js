import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../store/ThemeContext';
// import axios from 'axios'; // Uncomment if you use axios
// import { BASE_URL } from '../../config'; // Uncomment if you have a config file

const JobBoardScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Fetch Jobs from Backend ---
  const fetchJobs = async () => {
    try {
      // Replace with your actual IP address/Backend URL
      // If using emulator: http://10.0.2.2:5000/api/jobs/active
      // If using physical device: http://192.168.x.x:5000/api/jobs/active
      const response = await fetch('http://10.0.2.2:5000/api/jobs'); 
      const data = await response.json();

      if (response.ok) {
        setJobs(data);
        setFilteredJobs(data);
      } else {
        if(response.status !== 404) Alert.alert('Error', 'Failed to load jobs');
      }
    } catch (error) {
      console.error('Fetch Jobs Error:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- Search Logic (By Designation) ---
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = jobs.filter((job) => 
        job.designation.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  };

  const handleApplyPress = (job) => {
    // In the next step, we will create the 'JobApplication' screen
     navigation.navigate('JobApplication', { jobId: job._id, jobTitle: job.title });
    //Alert.alert("Apply Feature", `You selected: ${job.title}. Application form coming next!`);
  };

  const renderJobItem = ({ item }) => {
    // --- DEADLINE LOGIC ---
    const deadlineDate = new Date(item.deadline);
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0); // Reset time for accurate date comparison
    
    // Check if deadline is passed
    const isExpired = deadlineDate < currentDate;

    return (
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardHeader}>
          <View style={{flex: 1}}>
            <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.designation, { color: theme.primary }]}>{item.designation}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="medkit-outline" size={24} color={theme.primary} />
          </View>
        </View>

        <Text numberOfLines={2} style={[styles.description, { color: theme.secondaryText }]}>
          {item.description}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={16} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}> {item.salaryRange || 'Negotiable'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={isExpired ? 'red' : theme.secondaryText} />
            <Text style={[styles.metaText, { color: isExpired ? 'red' : theme.secondaryText }]}>
               Deadline: {new Date(item.deadline).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* --- Button Logic: Green if Active, Gray/Disabled if Expired --- */}
        <TouchableOpacity 
          style={[
            styles.applyButton, 
            { backgroundColor: isExpired ? '#A9A9A9' : 'green' } // Green vs Gray
          ]}
          onPress={() => handleApplyPress(item)}
          disabled={isExpired}
        >
          <Text style={styles.applyButtonText}>
            {isExpired ? "Deadline Over" : "Apply Now"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Career Opportunities</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground }]}>
        <Ionicons name="search" size={20} color={theme.secondaryText} />
        <TextInput 
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by Designation..."
          placeholderTextColor={theme.secondaryText}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJobItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={50} color={theme.secondaryText} />
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                Recently no openings available.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 20,
    paddingHorizontal: 15, height: 50, borderRadius: 12,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  card: {
    borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  jobTitle: { fontSize: 18, fontWeight: 'bold' },
  designation: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  description: { fontSize: 14, marginBottom: 15, lineHeight: 20 },
  metaContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, marginLeft: 5 },
  applyButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { textAlign: 'center', marginTop: 15, fontSize: 16 }
});

export default JobBoardScreen;