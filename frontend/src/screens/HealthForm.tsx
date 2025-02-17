// src/screens/HealthForm.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { logHealthData } from "../api/healthdata";

type Props = NativeStackScreenProps<RootStackParamList, "HealthForm">;

export default function HealthForm({ route, navigation }: Props) {
  const { token } = route.params;
  const [weight, setWeight] = useState<string>("");
  const [bp, setBp] = useState<string>("");
  const [glucose, setGlucose] = useState<string>("");

  const handleSubmit = async () => {
    if (!token) return;
    try {
      await logHealthData(token, {
        weight: parseFloat(weight),
        bp,
        glucose: parseFloat(glucose)
      });
      Alert.alert("Success", "Health data recorded");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.detail || "Unknown error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Health Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Pressure (e.g., 120/80)"
        value={bp}
        onChangeText={setBp}
      />
      <TextInput
        style={styles.input}
        placeholder="Glucose"
        keyboardType="numeric"
        value={glucose}
        onChangeText={setGlucose}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 8,
    borderRadius: 4
  }
});
