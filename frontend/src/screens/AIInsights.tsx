// src/screens/AIInsights.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getAIInsights } from "../api/ai";

type Props = NativeStackScreenProps<RootStackParamList, "AIInsights">;

export default function AIInsights({ route, navigation }: Props) {
  const { token } = route.params;
  const [insights, setInsights] = useState<string>("");

  const fetchInsights = async () => {
    if (!token) return;
    try {
      const data = await getAIInsights(token);
      setInsights(data.insights);
    } catch (error) {
      console.error("Failed to fetch AI insights:", error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Health Insights</Text>
      <ScrollView style={styles.insightContainer}>
        <Text>{insights}</Text>
      </ScrollView>
      <Button title="Refresh Insights" onPress={fetchInsights} />
      <Button title="Back to Dashboard" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  insightContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    maxHeight: 300
  }
});
