import React, { useState, useCallback } from "react";
import { SafeAreaView, View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getHealthData } from "../api/healthdata";

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
        <Text style={styles.cardText}>Weight: {item.weight}</Text>
        <Text style={styles.cardText}>BP: {item.bp}</Text>
        <Text style={styles.cardText}>Glucose: {item.glucose}</Text>
        <Text style={styles.cardText}>Logged on: {timestamp}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : entries.length > 0 ? (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.infoText}>No health data available. Please log some data.</Text>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Log Health Data" onPress={() => navigation.navigate("HealthForm", { token })} />
          <Button title="Get AI Insights" onPress={() => navigation.navigate("AIInsights", { token })} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 16,
  },
});
