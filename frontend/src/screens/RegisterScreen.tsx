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
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { registerUser } from "../api/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS, commonStyles } from "../theme/styles";

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
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
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
  },
});
