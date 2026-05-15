import { SignupFormData } from "../types/SignupFormData";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function signupUser(data: SignupFormData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Signup failed");
    }

    const data_response = await response.json();
    return data_response;
  } catch (error) {
    console.error("Signup: Caught error", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Login: Error response", errorData.message || errorData);
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login: Caught error", error);
    throw error;
  }
}
