import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Replace with your actual backend URL when deploying

export const getAIInsights = async () => {
  try {
    const response = await axios.get(`${API_URL}/ai/insights`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    throw error;
  }
};

export const submitHealthData = async (healthData: any) => {
  try {
    const response = await axios.post(`${API_URL}/healthdata`, healthData);
    return response.data;
  } catch (error) {
    console.error('Error submitting health data:', error);
    throw error;
  }
};
