import { StyleSheet } from 'react-native';

// Color palette
export const COLORS = {
  primary: '#4361EE',
  primaryDark: '#3A56D4',
  secondary: '#4CC9F0',
  background: '#F8F9FA',
  white: '#FFFFFF',
  black: '#000000',
  text: '#212529',
  textSecondary: '#6C757D',
  error: '#DC3545',
  success: '#198754',
  border: '#DEE2E6',
  card: '#FFFFFF',
  inputBg: '#FFFFFF',
  inactive: '#ADB5BD',
};

// Typography
export const FONTS = {
  thin: {
    fontWeight: '300' as const,
  },
  regular: {
    fontWeight: '400' as const,
  },
  medium: {
    fontWeight: '500' as const,
  },
  semiBold: {
    fontWeight: '600' as const,
  },
  bold: {
    fontWeight: '700' as const,
  },
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Common styles
export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    ...FONTS.bold,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
    ...FONTS.medium,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    ...SHADOWS.small,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    ...FONTS.semiBold,
  },
  secondaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    ...FONTS.semiBold,
  },
  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    ...FONTS.semiBold,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    ...FONTS.medium,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});