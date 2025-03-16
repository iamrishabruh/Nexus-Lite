import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getAIInsights } from "../api/ai";

type Props = NativeStackScreenProps<RootStackParamList, "AIInsights">;

const AIInsights = ({ route, navigation }: Props) => {
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>AI Health Insights</Text>
        <ScrollView style={styles.insightContainer}>
          <Text style={styles.insightText}>{insights}</Text>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button title="Refresh Insights" onPress={fetchInsights} />
          <Button title="Back to Dashboard" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AIInsights;

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
  insightContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flex: 1,
  },
  insightText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
