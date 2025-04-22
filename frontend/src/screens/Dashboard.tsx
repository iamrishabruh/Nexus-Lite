import React, { useState, useCallback } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  StatusBar 
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getHealthData } from "../api/healthdata";
import { COLORS, commonStyles, SHADOWS } from "../theme/styles";
import Icon from "react-native-vector-icons/Ionicons";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

const Dashboard = ({ route, navigation }: Props) => {
  const { token } = route.params;
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHealthData(token);
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch health data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Re-fetch health data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const renderItem = ({ item }: { item: any }) => {
    // Convert the timestamp string to a readable format
    const timestamp = new Date(item.timestamp).toLocaleString();
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateTime}>{timestamp}</Text>
        </View>
        
        <View style={styles.dataRow}>
          <View style={styles.metric}>
            <Icon name="fitness-outline" size={24} color={COLORS.primary} />
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>{item.weight} <Text style={styles.metricUnit}>lbs</Text></Text>
          </View>
          
          <View style={styles.metric}>
            <Icon name="heart-outline" size={24} color={COLORS.primary} />
            <Text style={styles.metricLabel}>Blood Pressure</Text>
            <Text style={styles.metricValue}>{item.bp} <Text style={styles.metricUnit}>mmHg</Text></Text>
          </View>
          
          <View style={styles.metric}>
            <Icon name="water-outline" size={24} color={COLORS.primary} />
            <Text style={styles.metricLabel}>Glucose</Text>
            <Text style={styles.metricValue}>{item.glucose} <Text style={styles.metricUnit}>mg/dL</Text></Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Dashboard</Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading your health data...</Text>
          </View>
        ) : entries.length > 0 ? (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="clipboard-outline" size={80} color={COLORS.inactive} />
            <Text style={styles.emptyText}>No health data available</Text>
            <Text style={styles.emptySubtext}>Start tracking your health metrics today</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("HealthForm", { token })}
          >
            <Icon name="add-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Log Health Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.insightsButton]}
            onPress={() => navigation.navigate("AIInsights", { token })}
          >
            <Icon name="brain" size={24} color={COLORS.white} />
            <Text style={styles.actionButtonText}>AI Insights</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  dateTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  metricUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  insightsButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
