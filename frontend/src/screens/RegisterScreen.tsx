import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
<<<<<<< HEAD
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Platform,
=======
  ActivityIndicator,
>>>>>>> rescue-branch
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { registerUser } from "../api/auth";
import { Formik } from "formik";
import * as Yup from "yup";
<<<<<<< HEAD
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS, commonStyles } from "../theme/styles";
=======
import Ionicons from "react-native-vector-icons/Ionicons";
>>>>>>> rescue-branch

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

<<<<<<< HEAD
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
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        style={commonStyles.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={commonStyles.title}>Create Account</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Formik
              initialValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  {errors.general && <Text style={commonStyles.errorText}>{errors.general}</Text>}
                  
                  <View style={styles.nameRow}>
                    <View style={[commonStyles.inputContainer, { flex: 1, marginRight: 8 }]}>
                      <Text style={commonStyles.inputLabel}>First Name</Text>
                      <TextInput
                        placeholder="First Name"
                        placeholderTextColor={COLORS.inactive}
                        autoCapitalize="words"
                        style={commonStyles.input}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        value={values.firstName}
                      />
                      {errors.firstName && touched.firstName && <Text style={commonStyles.errorText}>{errors.firstName}</Text>}
                    </View>
                    
                    <View style={[commonStyles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                      <Text style={commonStyles.inputLabel}>Last Name</Text>
                      <TextInput
                        placeholder="Last Name"
                        placeholderTextColor={COLORS.inactive}
                        autoCapitalize="words"
                        style={commonStyles.input}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        value={values.lastName}
                      />
                      {errors.lastName && touched.lastName && <Text style={commonStyles.errorText}>{errors.lastName}</Text>}
                    </View>
                  </View>
                  
                  <View style={commonStyles.inputContainer}>
                    <Text style={commonStyles.inputLabel}>Email</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Email address"
                        placeholderTextColor={COLORS.inactive}
                        autoCapitalize="none"
                        keyboardType="email-address"
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
                        placeholder="Password (min 6 characters)"
                        placeholderTextColor={COLORS.inactive}
                        secureTextEntry={secureTextEntry}
                        autoCapitalize="none"
                        style={[commonStyles.input, { flex: 1, borderWidth: 0 }]}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                      />
                      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <Icon name={secureTextEntry ? "eye-off" : "eye"} size={20} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    {errors.password && touched.password && <Text style={commonStyles.errorText}>{errors.password}</Text>}
                  </View>
                  
                  <View style={commonStyles.inputContainer}>
                    <Text style={commonStyles.inputLabel}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Confirm your password"
                        placeholderTextColor={COLORS.inactive}
                        secureTextEntry={secureTextEntryConfirm}
                        autoCapitalize="none"
                        style={[commonStyles.input, { flex: 1, borderWidth: 0 }]}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                      />
                      <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                        <Icon name={secureTextEntryConfirm ? "eye-off" : "eye"} size={20} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <Text style={commonStyles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>
                  
                  {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
                  ) : (
                    <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
                      <Text style={commonStyles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={commonStyles.textButton} 
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={commonStyles.textButtonText}>Already have an account? Sign in</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
=======
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
>>>>>>> rescue-branch
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
  headerContainer: {
    marginBottom: 24,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 4,
    zIndex: 10,
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
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
=======
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
>>>>>>> rescue-branch
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 4,
  },
});