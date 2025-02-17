// frontend/src/api/index.ts
import axios from "axios";

// Adjust baseURL to your backend server (e.g., running at localhost:8000)
const apiClient = axios.create({
  baseURL: "http://localhost:8081", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally add interceptors
// apiClient.interceptors.request.use((config) => {
//   // e.g., attach JWT from async storage
//   return config;
// });

export default apiClient;
