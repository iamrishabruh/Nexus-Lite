// frontend/src/api/index.ts
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const apiClient = axios.create({
  baseURL: backendUrl,
  headers: { "Content-Type": "application/json" },
});
export default apiClient;

