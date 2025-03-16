import apiClient from "./index";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload): Promise<any> {
  const response = await apiClient.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload: LoginPayload): Promise<{ access_token: string; token_type: string }> {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
}
