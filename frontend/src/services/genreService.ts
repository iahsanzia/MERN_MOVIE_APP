const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name?: string;
}

/**
 * Fetch genres from the backend TMDB endpoint
 */
export async function fetchGenres(): Promise<Genre[]> {
  try {
    const token = localStorage.getItem("authToken");
    const url = `${API_BASE_URL}/api/tmdb/genres`;
    console.log("Fetching genres from:", url);
    console.log("Token present:", !!token);

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    console.log("Genres response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Genres error response:", errorText);
      throw new Error(
        `Failed to fetch genres: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("Genres response data:", data);

    // Response structure: { status, message, data: { status, genres: [...] } }
    const genres = data.data?.genres || [];
    console.log("Extracted genres:", genres);

    return Array.isArray(genres) ? genres : [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
}

/**
 * Fetch languages from backend TMDB endpoint
 */
export async function fetchLanguages(): Promise<Language[]> {
  try {
    console.log("Fetching languages from backend...");
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_BASE_URL}/api/tmdb/languages`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    console.log("Languages response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Languages error response:", errorText);
      throw new Error(
        `Failed to fetch languages: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("Languages response data:", data);

    // Response structure: { status, message, data: { status, languages: [...] } }
    const languages = data.data?.languages || [];
    console.log("Extracted languages:", languages);

    return Array.isArray(languages) ? languages : [];
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
}
