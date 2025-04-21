import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { registerUser } from "../api/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const RegisterScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSecureEntry = useCallback(() => {
    setSecureTextEntry((prev) => !prev);
  }, []);

  const handleRegister = useCallback(
    async (values: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      confirm_password: string;
    }) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        await registerUser({
          firstName: values.first_name,
          lastName: values.last_name,
          email: values.email,
          password: values.password,
        });
        navigation.replace("Login");
      } catch (error: any) {
        const message = error.response?.data?.detail || "Registration failed";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Create Account</Text>

        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <TextInput
                placeholder="First Name"
                style={styles.input}
                onChangeText={handleChange("first_name")}
                onBlur={handleBlur("first_name")}
                value={values.first_name}
              />
              {touched.first_name && errors.first_name && <Text style={styles.error}>{errors.first_name}</Text>}

              <TextInput
                placeholder="Last Name"
                style={styles.input}
                onChangeText={handleChange("last_name")}
                onBlur={handleBlur("last_name")}
                value={values.last_name}
              />
              {touched.last_name && errors.last_name && <Text style={styles.error}>{errors.last_name}</Text>}

              <TextInput
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  style={[styles.input, { flex: 1 }]}
                  secureTextEntry={secureTextEntry}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
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

              <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                secureTextEntry={secureTextEntry}
                onChangeText={handleChange("confirm_password")}
                onBlur={handleBlur("confirm_password")}
                value={values.confirm_password}
              />
              {touched.confirm_password && errors.confirm_password && (
                <Text style={styles.error}>{errors.confirm_password}</Text>
              )}

              {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

              {loading ? (
                <ActivityIndicator style={{ marginTop: 16 }} size="large" color="#007AFF" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 24,
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
});