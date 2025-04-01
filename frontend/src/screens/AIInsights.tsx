import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, View,  Text,  Button, ScrollView, StyleSheet, RefreshControl, ActivityIndicator,} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getAIInsights } from "../api/ai";

type Props = NativeStackScreenProps<RootStackParamList, "AIInsights">;

const AIInsights = ({ route, navigation }: Props) => {
  const { token } = route.params;
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAIInsights(token);
      setInsights(data.insights);
    } catch (error) {
      console.error("Failed to fetch AI insights:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const renderInsightCards = () => {
    if (!insights) return <Text style={styles.cardText}>No insights available at the moment.</Text>;
    return insights.split("\n\n").map((item, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.cardText}>{item.trim()}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>AI Health Insights</Text>
        {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 12 }} />}
        <ScrollView
          style={styles.insightContainer}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchInsights} />}
        >
          {renderInsightCards()}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button title="Refresh Insights" onPress={fetchInsights} disabled={loading} />
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
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 4,
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
