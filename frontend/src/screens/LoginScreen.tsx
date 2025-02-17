import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../api/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleLogin = async () => {
    // Clear previous error message
    setErrorMsg("");
    // Basic client-side validation
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      console.log("Login response:", data);
      if (data && data.access_token) {
        // Navigate to Dashboard with token
        navigation.navigate("Dashboard", { token: data.access_token });
      } else {
        setErrorMsg("Login failed: no token returned.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg(
        error.response?.data?.detail ||
        "An unexpected error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <View style={styles.registerContainer}>
        <Button title="Go to Register" onPress={() => navigation.navigate("Register")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  spinner: {
    marginVertical: 16,
  },
  registerContainer: {
    marginTop: 16,
  },
});
