import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ActivityIndicator, 
  StyleSheet 
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../api/auth";
import { Pressable } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg(""); // Clear previous errors

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });

      if (data?.access_token) {
        navigation.navigate("Dashboard", { token: data.access_token });
      } else {
        setErrorMsg("Invalid login credentials.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg(error.response?.data?.detail || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888" // Makes placeholder visible
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { color: "black" }]} // Ensures text is black
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      style={[styles.input, { color: "black" }]}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      ) : (
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      )}

      <Pressable style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </Pressable>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  spinner: {
    marginVertical: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  registerText: {
    color: "#007BFF",
    fontSize: 14,
  },
});