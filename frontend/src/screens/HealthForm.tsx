import React, { useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { logHealthData } from "../api/healthdata";
import { COLORS, commonStyles } from "../theme/styles";
import Icon from "react-native-vector-icons/Ionicons";

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
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Health Data</Text>
        </View>
        
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color={COLORS.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.metricContainer}>
            <View style={styles.metricHeader}>
              <Icon name="fitness-outline" size={24} color={COLORS.primary} />
              <Text style={styles.metricTitle}>Weight</Text>
            </View>
            
            <View style={styles.metricValueContainer}>
              <Text style={styles.currentValue}>{weight}</Text>
              <Text style={styles.unitLabel}>lbs</Text>
            </View>
            
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={400}
              step={1}
              value={weight}
              onValueChange={setWeight}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
            
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>50 lbs</Text>
              <Text style={styles.rangeLabel}>400 lbs</Text>
            </View>
          </View>
          
          <View style={styles.metricContainer}>
            <View style={styles.metricHeader}>
              <Icon name="heart-outline" size={24} color={COLORS.primary} />
              <Text style={styles.metricTitle}>Blood Pressure</Text>
            </View>
            
            <View style={styles.metricValueContainer}>
              <Text style={styles.currentValue}>{bp}/{bp - 40}</Text>
              <Text style={styles.unitLabel}>mmHg</Text>
            </View>
            
            <Slider
              style={styles.slider}
              minimumValue={60}
              maximumValue={250}
              step={1}
              value={bp}
              onValueChange={setBp}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
            
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>60 mmHg</Text>
              <Text style={styles.rangeLabel}>250 mmHg</Text>
            </View>
            
            <Text style={styles.note}>
              Diastolic will be set as systolic - 40 for demonstration
            </Text>
          </View>
          
          <View style={styles.metricContainer}>
            <View style={styles.metricHeader}>
              <Icon name="water-outline" size={24} color={COLORS.primary} />
              <Text style={styles.metricTitle}>Glucose</Text>
            </View>
            
            <View style={styles.metricValueContainer}>
              <Text style={styles.currentValue}>{glucose}</Text>
              <Text style={styles.unitLabel}>mg/dL</Text>
            </View>
            
            <Slider
              style={styles.slider}
              minimumValue={40}
              maximumValue={400}
              step={1}
              value={glucose}
              onValueChange={setGlucose}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
            
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>40 mg/dL</Text>
              <Text style={styles.rangeLabel}>400 mg/dL</Text>
            </View>
          </View>
        </ScrollView>
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
        ) : (
          <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
            <Text style={commonStyles.buttonText}>Save Health Data</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HealthForm;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To balance with back button
  },
  formContainer: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 8,
    flex: 1,
  },
  metricContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
  },
  unitLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  note: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  spinner: {
    marginVertical: 16,
  },
});
