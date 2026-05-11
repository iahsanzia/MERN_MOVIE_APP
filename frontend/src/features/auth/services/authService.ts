import { SignupFormData } from "../types/SignupFormData";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function signupUser(data: SignupFormData) {
  try {
    console.log(
      "📝 Signup: Sending signup request to",
      `${API_BASE_URL}/api/auth/register`,
    );
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("📝 Signup: Response status", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("📝 Signup: Error response", errorData);
      throw new Error(errorData.message || "Signup failed");
    }

    const data_response = await response.json();
    console.log("📝 Signup: Success response", data_response);
    return data_response;
  } catch (error) {
    console.error("📝 Signup: Caught error", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    console.log(
      "🔐 Login: Sending request to",
      `${API_BASE_URL}/api/auth/login`,
    );
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("🔐 Login: Response status", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("🔐 Login: Error response", errorData.message || errorData);
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    console.log("🔐 Login: Success", data);
    return data;
  } catch (error) {
    console.error("🔐 Login: Caught error", error);
    throw error;
  }
}
