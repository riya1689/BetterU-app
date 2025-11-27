import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Helper to map score back to emoji
const getEmojiForScore = (score) => {
    if (score >= 5) return '🤩';
    if (score >= 4) return '🙂';
    if (score >= 3) return '😐';
    if (score >= 2) return '😔';
    return '😡'; // Score 1
};

const AnalyticsScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { user } = useAuth();
    const themedStyles = styles(theme);

    const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ today: [], week: [], insight: '' });

    // Header Date
    const todayDate = new Date();
    const monthYear = todayDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const fetchData = async () => {
        setLoading(true);
        try {
            let token = user?.token;
            if (!token) token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://10.0.2.2:5000/api/moods/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setData(result);
            }
        } catch (error) {
            console.log("Analytics Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    // --- Prepare Chart Data ---
    let chartLabels = [];
    let chartDataPoints = [];

    if (viewMode === 'daily') {
        // Daily View: Morning, Afternoon, Evening
        chartLabels = ['Morning', 'Afternoon', 'Evening'];
        // Default 3 (Neutral) if no data
        const morning = data.today.find(m => m.timeOfDay === 'Morning')?.score || 3;
        const afternoon = data.today.find(m => m.timeOfDay === 'Afternoon')?.score || 3;
        const evening = data.today.find(m => m.timeOfDay === 'Evening')?.score || 3;
        chartDataPoints = [morning, afternoon, evening];
    } else {
        // Weekly View: Last 7 entries or mapped by day
        // Simplifying for visualization: Take last 7 items from 'week' data or fill with 3
        chartLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Static labels for simplicity
        
        // Map actual data to last 7 points (simplified logic)
        const recentMoods = data.week.slice(-7); 
        chartDataPoints = recentMoods.map(m => m.score);
        
        // Fill remaining if less than 7
        while(chartDataPoints.length < 7) {
            chartDataPoints.unshift(3); // Pad with neutral
        }
    }

    return (
        <SafeAreaView style={[themedStyles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={themedStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[themedStyles.headerTitle, { color: theme.text }]}>Mood Analysis</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Toggle View */}
            <View style={themedStyles.toggleContainer}>
                <Text style={[themedStyles.subHeader, {color: theme.text}]}>
                    {viewMode === 'daily' ? 'Today' : 'This Week'}
                </Text>
                <View style={themedStyles.toggleButtons}>
                    <TouchableOpacity onPress={() => setViewMode('daily')}>
                        <Ionicons name="today" size={24} color={viewMode === 'daily' ? theme.primary : theme.secondaryText} style={{marginRight: 15}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode('weekly')}>
                        <Ionicons name="calendar" size={24} color={viewMode === 'weekly' ? theme.primary : theme.secondaryText} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Graph Container */}
            <View style={themedStyles.graphContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} />
                ) : (
                    <View>
                        {/* Custom Header for Graph */}
                        <View style={themedStyles.dateHeader}>
                            <Text style={{color: theme.secondaryText, fontSize: 16}}>{monthYear}</Text>
                        </View>
                        
                        <LineChart
                            data={{
                                labels: chartLabels,
                                datasets: [{ data: chartDataPoints }]
                            }}
                            width={width - 40} // from react-native
                            height={220}
                            yAxisInterval={1} 
                            chartConfig={{
                                backgroundColor: theme.background,
                                backgroundGradientFrom: theme.background,
                                backgroundGradientTo: theme.background,
                                decimalPlaces: 0, 
                                color: (opacity = 1) => `rgba(26, 83, 92, ${opacity})`, // Using your primary teal color
                                labelColor: (opacity = 1) => theme.text,
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                },
                                propsForBackgroundLines: {
                                    strokeDasharray: "", // solid lines
                                    stroke: theme.card // subtle grid
                                }
                            }}
                            bezier // Makes the line curved
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                            withHorizontalLabels={false} // Hide Y axis numbers (we use emojis)
                            renderDotContent={({ x, y, index, indexData }) => (
                                <View
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: y - 15, // Adjust to center emoji on dot
                                        left: x - 10,
                                    }}
                                >
                                    <Text style={{ fontSize: 20 }}>
                                        {getEmojiForScore(indexData)}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>

            {/* Insight / Discussion Section */}
            <View style={themedStyles.insightContainer}>
                <View style={[themedStyles.circleIndicator, {borderColor: theme.primary}]}>
                    <Text style={[themedStyles.percentText, {color: theme.primary}]}>
                        {viewMode === 'daily' ? 'Day' : '7d'}
                    </Text>
                </View>
                <Text style={[themedStyles.insightText, {color: theme.text}]}>
                    {data.insight || "Keep tracking to get insights!"}
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = (theme) => StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 20
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginBottom: 20
    },
    subHeader: { fontSize: 18, fontWeight: '600' },
    toggleButtons: { flexDirection: 'row' },
    graphContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    dateHeader: {
        alignSelf: 'flex-start',
        paddingLeft: 10,
        marginBottom: 10
    },
    insightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: 40
    },
    circleIndicator: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    percentText: { fontSize: 18, fontWeight: 'bold' },
    insightText: { flex: 1, fontSize: 16, lineHeight: 22 },
});

export default AnalyticsScreen;