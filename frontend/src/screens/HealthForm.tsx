import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { logHealthData } from "../api/healthdata";
import axios from "axios";

type Props = NativeStackScreenProps<RootStackParamList, "HealthForm">;

const HealthForm = ({ route, navigation }: Props) => {
  const { token } = route.params;

  const [weight, setWeight] = useState<number>(150);
  const [bp, setBp] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [glucose, setGlucose] = useState<number>(90);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [token]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:8000/healthdata/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!token) return;
    setLoading(true);
    setErrorMessage(null);

    const payload = {
      weight,
      bp: `${bp}/${diastolic}`,
      glucose,
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/healthdata/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await logHealthData(token, payload);
      }

      Alert.alert("Success", editingId ? "Entry updated." : "Data recorded.");
      setEditingId(null);
      fetchEntries();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.detail || "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: any) => {
    console.log("Edit clicked:", entry); // 👈 test line
    const [sys, dia] = entry.bp.split("/").map(Number);
    setWeight(entry.weight);
    setBp(sys);
    setDiastolic(dia);
    setGlucose(entry.glucose);
    setEditingId(entry.id);
  };

  const handleDelete = async (id: number) => {
    console.log("Delete clicked for ID:", id); // 👈 test line
    try {
      await axios.delete(`http://localhost:8000/healthdata/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntries();
    } catch (error) {
      Alert.alert("Error", "Could not delete entry.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log Health Data</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Text style={styles.label}>Weight (lbs): {weight}</Text>
        <Slider style={styles.slider} minimumValue={50} maximumValue={400} step={1} value={weight} onValueChange={setWeight} />

        <Text style={styles.label}>Systolic (mmHg): {bp}</Text>
        <Slider style={styles.slider} minimumValue={60} maximumValue={250} step={1} value={bp} onValueChange={setBp} />

        <Text style={styles.label}>Diastolic (mmHg): {diastolic}</Text>
        <Slider style={styles.slider} minimumValue={40} maximumValue={150} step={1} value={diastolic} onValueChange={setDiastolic} />

        <Text style={styles.label}>Glucose (mg/dL): {glucose}</Text>
        <Slider style={styles.slider} minimumValue={40} maximumValue={400} step={1} value={glucose} onValueChange={setGlucose} />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        ) : (
          <Button title={editingId ? "Update Entry" : "Submit"} onPress={handleSubmit} />
        )}

        {editingId && (
          <Button
            title="Cancel Edit"
            color="gray"
            onPress={() => {
              setEditingId(null);
              setWeight(150);
              setBp(120);
              setDiastolic(80);
              setGlucose(90);
            }}
          />
        )}

        <Text style={[styles.title, { marginTop: 30 }]}>Your Health Logs</Text>
        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <Text>Weight: {entry.weight} lbs</Text>
            <Text>BP: {entry.bp}</Text>
            <Text>Glucose: {entry.glucose} mg/dL</Text>
            <View style={styles.entryButtons}>
              <Button title="Edit" onPress={() => handleEdit(entry)} />
              <View style={{ width: 10 }} />
              <Button title="Delete" color="red" onPress={() => handleDelete(entry.id)} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  spinner: {
    marginVertical: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  entryCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  entryButtons: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "flex-start",
  },
});
