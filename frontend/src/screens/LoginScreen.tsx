import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { Button } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { loginUser } from "../api/auth"; // Ensure this function is properly implemented

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await loginUser(email, password); // Assuming this function calls your API
      Alert.alert("Success", "Login successful!");
      navigation.replace("Dashboard"); // ✅ Navigate to Dashboard
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Nexus</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        secureTextEntry
      />
      
      <Button style={styles.button} onPress={handleLogin} isDisabled={loading}>
        <Text style={styles.buttonText}>Login</Text>
      </Button>

      <Button style={styles.button} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.buttonText}>Don't have an account? Register</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    width: "100%",
    padding: 12,
    borderRadius: 5,
    marginVertical: 10, // Spaced out buttons
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default LoginScreen;