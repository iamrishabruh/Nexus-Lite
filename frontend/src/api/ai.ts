// frontend/src/api/ai.ts
import apiClient from "./index";

export async function getAIInsights(token: string) {
  const response = await apiClient.post("/ai/", {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data; // { insights: string }
}
