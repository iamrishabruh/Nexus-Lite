import axios from "axios";

const API_URL = "http://localhost:8000"; // Hardcoded API URL

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for making API requests
export const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};
