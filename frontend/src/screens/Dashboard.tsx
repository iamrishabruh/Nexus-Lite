import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getHealthData } from "../api/healthdata";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function Dashboard({ route, navigation }: Props) {
  const { token } = route.params;
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("Dashboard token:", token);
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getHealthData(token);
      console.log("Fetched health data:", data);
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.entryContainer}>
      <Text>Weight: {item.weight}</Text>
      <Text>BP: {item.bp}</Text>
      <Text>Glucose: {item.glucose}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {/* Debugging info: display the token */}
      <Text style={styles.tokenText}>Token: {token}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      ) : (
        <Text>No health data available. Please log some data.</Text>
      )}
      <Button
        title="Log Health Data"
        onPress={() => navigation.navigate("HealthForm", { token })}
      />
      <Button
        title="Get AI Insights"
        onPress={() => navigation.navigate("AIInsights", { token })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  tokenText: {
    fontSize: 10,
    color: "gray",
    marginBottom: 8,
    textAlign: "center",
  },
  list: { marginBottom: 16 },
  entryContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});
