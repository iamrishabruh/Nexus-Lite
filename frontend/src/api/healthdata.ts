// src/api/healthdata.ts
import apiClient from "./index";

interface HealthDataPayload {
  weight: number;
  bp: string;
  glucose: number;
}

export async function logHealthData(token: string, payload: HealthDataPayload): Promise<any> {
  const response = await apiClient.post("/healthdata/", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

export async function getHealthData(token: string): Promise<any[]> {
  const response = await apiClient.get("/healthdata/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}
