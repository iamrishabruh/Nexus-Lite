import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { submitHealthData } from '../api/healthdata';

type RootStackParamList = {
  Dashboard: undefined;
  HealthForm: undefined;
  AIInsights: undefined;
};

type HealthFormProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HealthForm'>;
};

const HealthForm: React.FC<HealthFormProps> = ({ navigation }) => {
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [glucose, setGlucose] = useState('');

  const handleSubmit = async () => {
    try {
      await submitHealthData(parseFloat(weight), bloodPressure, parseFloat(glucose));
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error("Health data submission failed", error);
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Weight (kg)" 
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput 
        placeholder="Blood Pressure (e.g., 120/80)" 
        onChangeText={setBloodPressure}
      />
      <TextInput 
        placeholder="Glucose (mg/dL)" 
        onChangeText={setGlucose}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default HealthForm;
