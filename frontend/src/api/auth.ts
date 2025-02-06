import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Replace with your actual backend URL when deploying

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
