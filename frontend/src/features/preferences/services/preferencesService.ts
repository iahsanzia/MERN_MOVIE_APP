import { Preferences } from "../types/Preferences";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function updatePreferences(
  userId: string,
  preferences: Preferences,
): Promise<Preferences> {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/preferences`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update preferences");
  }

  return response.json();
}
