import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { registerUser } from "../api/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);

  const togglePasswordVisibility = useCallback(() => {
    setSecureTextEntry((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setSecureTextEntryConfirm((prev) => !prev);
  }, []);

  const handleRegister = async (
    values: { firstName: string; lastName: string; email: string; password: string; confirmPassword: string },
    { setFieldError, resetForm }: any
  ) => {
    setLoading(true);
    try {
      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      resetForm();
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Registration error:", error);
      setFieldError("general", error.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text style={styles.title}>Create Account</Text>
        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor="#888"
                  autoCapitalize="words"
                  style={styles.input}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                />
                {errors.firstName && touched.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor="#888"
                  autoCapitalize="words"
                  style={styles.input}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                />
                {errors.lastName && touched.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    style={[styles.input, { flex: 1 }]}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Icon name={secureTextEntry ? "eye-off" : "eye"} size={24} color="#888" />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    secureTextEntry={secureTextEntryConfirm}
                    autoCapitalize="none"
                    style={[styles.input, { flex: 1 }]}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                  />
                  <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                    <Icon name={secureTextEntryConfirm ? "eye-off" : "eye"} size={24} color="#888" />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingRight: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
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
});
