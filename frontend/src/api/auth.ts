import axios from 'axios';

const API_BASE_URL = 'http://your-api-url.com'; // Replace with backend URL

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || 'Login failed';
  }
};

type RegisterUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};


type RegisterResponse = {
  message: string;
  userId?: string; // Assuming the API returns a user ID
};

export const registerUser = async (userData: RegisterUserData): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};