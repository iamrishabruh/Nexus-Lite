import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Replace with your actual backend URL when deploying

export const submitHealthData = async (weight: number, bloodPressure: string, glucose: number) => {
  try {
    const response = await axios.post(`${API_URL}/healthdata`, { weight, bloodPressure, glucose });
    return response.data;
  } catch (error) {
    console.error('Error submitting health data:', error);
    throw error;
  }
};

export const getHealthData = async () => {
  try {
    const response = await axios.get(`${API_URL}/healthdata`);
    return response.data;
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};
