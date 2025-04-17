import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../api/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS, commonStyles } from "../theme/styles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = useCallback(() => {
    setSecureTextEntry((prev) => !prev);
  }, []);

  const handleLogin = useCallback(
    async (values: { email: string; password: string }, { setFieldError }: any) => {
      setLoading(true);
      try {
        const data = await loginUser({ email: values.email, password: values.password });
        if (data?.access_token) {
          navigation.navigate("Dashboard", { token: data.access_token });
        } else {
          setFieldError("general", "Invalid login credentials.");
        }
      } catch (error: any) {
        console.error("Login error:", error);
        setFieldError("general", error.response?.data?.detail || "Login failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [navigation]
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        style={commonStyles.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>Nexus Health</Text>
          <Text style={styles.tagline}>Track your health journey</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={commonStyles.title}>Sign In</Text>
          <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleLogin}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
                {errors.general && <Text style={commonStyles.errorText}>{errors.general}</Text>}
                
                <View style={commonStyles.inputContainer}>
                  <Text style={commonStyles.inputLabel}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor={COLORS.inactive}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={commonStyles.input}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                    />
                  </View>
                  {errors.email && touched.email && <Text style={commonStyles.errorText}>{errors.email}</Text>}
                </View>
                
                <View style={commonStyles.inputContainer}>
                  <Text style={commonStyles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.inactive}
                      autoCapitalize="none"
                      secureTextEntry={secureTextEntry}
                      style={[commonStyles.input, { flex: 1 }]}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
                      <Icon name={secureTextEntry ? "eye-off" : "eye"} size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && <Text style={commonStyles.errorText}>{errors.password}</Text>}
                </View>
                
                {loading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
                ) : (
                  <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
                    <Text style={commonStyles.buttonText}>Sign In</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={commonStyles.textButton} onPress={() => navigation.navigate("Register")}>
                  <Text style={commonStyles.textButtonText}>Don't have an account? Create one</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: "700",
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  eyeIcon: {
    padding: 16,
  },
  spinner: {
    marginVertical: 20,
  },
});
