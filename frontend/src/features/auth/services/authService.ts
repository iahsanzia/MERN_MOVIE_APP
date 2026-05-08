import { SignupFormData } from "../types/SignupFormData";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function signupUser(data: SignupFormData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
}
