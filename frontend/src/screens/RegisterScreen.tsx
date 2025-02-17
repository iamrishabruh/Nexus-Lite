import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { registerUser } from "../api/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleRegister = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ email, password });
      // Optionally, show a success message
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMsg(
        error.response?.data?.detail ||
        "An unexpected error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
        <Button title="Register" onPress={handleRegister} />
      )}
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
});
