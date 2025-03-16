import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, Alert, StyleSheet, ActivityIndicator } from "react-native";
import Slider from "@react-native-community/slider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { logHealthData } from "../api/healthdata";

type Props = NativeStackScreenProps<RootStackParamList, "HealthForm">;

const HealthForm = ({ route, navigation }: Props) => {
  const { token } = route.params;
  // Default slider values (adjust ranges as needed)
  const [weight, setWeight] = useState<number>(150);       // in lbs
  const [bp, setBp] = useState<number>(120);                // use systolic as a slider value, e.g., 120 mmHg
  const [glucose, setGlucose] = useState<number>(90);       // in mg/dL
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!token) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      await logHealthData(token, {
        weight,
        bp: `${bp}/${bp - 40}`, // Example: assuming diastolic is 40 less than systolic; adjust as needed
        glucose,
      });
      Alert.alert("Success", "Health data recorded successfully");
      navigation.goBack();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.detail || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Log Health Data</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Text style={styles.label}>Weight (lbs): {weight}</Text>
        <Slider
          style={styles.slider}
          minimumValue={50}
          maximumValue={400}
          step={1}
          value={weight}
          onValueChange={setWeight}
          minimumTrackTintColor="#007BFF"
          maximumTrackTintColor="#ccc"
        />

        <Text style={styles.label}>Blood Pressure (Systolic mmHg): {bp}</Text>
        <Slider
          style={styles.slider}
          minimumValue={60}
          maximumValue={250}
          step={1}
          value={bp}
          onValueChange={setBp}
          minimumTrackTintColor="#007BFF"
          maximumTrackTintColor="#ccc"
        />
        <Text style={styles.note}>Diastolic will be set as systolic - 40 for demonstration.</Text>

        <Text style={styles.label}>Glucose (mg/dL): {glucose}</Text>
        <Slider
          style={styles.slider}
          minimumValue={40}
          maximumValue={400}
          step={1}
          value={glucose}
          onValueChange={setGlucose}
          minimumTrackTintColor="#007BFF"
          maximumTrackTintColor="#ccc"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        ) : (
          <Button title="Submit" onPress={handleSubmit} />
        )}
      </View>
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
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  note: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
});
