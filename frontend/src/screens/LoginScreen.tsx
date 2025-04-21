import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../api/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSecureEntry = useCallback(() => {
    setSecureTextEntry((prev) => !prev);
  }, []);

  const handleLogin = useCallback(async (values: { email: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await loginUser({ email: values.email, password: values.password });
      const token = data.access_token;
      navigation.replace("Dashboard", { token });
    } catch (error: any) {
      const message = error.response?.data?.detail || "Login failed";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              returnKeyType="next"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                style={[styles.input, { flex: 1 }]}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                onSubmitEditing={() => handleSubmit()}
              />
              <TouchableOpacity onPress={toggleSecureEntry} style={styles.icon}>
                <Ionicons
                  name={secureTextEntry ? "eye-off" : "eye"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            {loading ? (
              <ActivityIndicator style={{ marginTop: 16 }} size="large" color="#007AFF" />
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Text style={styles.link}>Don’t have an account? Create one</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 4,
  },
  link: {
    marginTop: 16,
    color: "#007AFF",
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});