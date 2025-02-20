import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { registerUser } from "../api/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateAccount = async () => {
    setErrorMsg("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ firstName, lastName, email, password });
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMsg(error.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TextInput
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        style={[styles.input, { color: "black" }]}
      />

      <TextInput
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        style={[styles.input, { color: "black" }]}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[styles.input, { color: "black" }]}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { color: "black" }]}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, { color: "black" }]}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      ) : null}

      {/* "Create Account" Button at Bottom */}
      <Pressable style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", // Centers everything vertically
    alignItems: "center", // Centers everything horizontally
    padding: 16, 
    backgroundColor: "#fff",
  },
  title: { 
    fontSize: 24, 
    marginBottom: 16, 
    textAlign: "center", 
    fontWeight: "bold" 
  },
  input: {
    width: "90%", // Makes input fields responsive
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  spinner: {
    marginVertical: 16,
  },
  button: {
    width: "90%", // Makes button same width as inputs
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20, // Adds space above the button
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});