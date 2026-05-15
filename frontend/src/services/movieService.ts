import { Movie, MovieDetails } from "../features/movies/types/index";
import { Favorite, Watched } from "../features/movies/types/index";

const API_BASE_URL =
  `${process.env.REACT_APP_API_URL}/api` || "http://localhost:5000/api";

const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  console.log(
    "[movieService] Auth token from localStorage:",
    token ? "✓ Found" : "✗ Missing",
  );
  return token;
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export const movieService = {
  async createMovie(movieData: {
    movieId: number | string;
    title: string;
    summary: string;
    releaseDate: string;
    posterPath: string;
    genres: string[];
    director: string;
    cast: string[];
    rating: number;
  }): Promise<{ _id: string; movieId: string | number }> {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ...movieData,
        movieId: movieData.movieId.toString(),
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create movie");
    }
    return response.json().then((data) => data.data);
  },

  async getAllMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/movies`);
    if (!response.ok) throw new Error("Failed to fetch movies");
    const data = await response.json();
    return data.data || [];
  },

  async getUserSearchedMovies(userId: string): Promise<Movie[]> {
    console.log(
      "[movieService] Fetching user searched movies for userId:",
      userId,
    );
    const headers = getHeaders();
    console.log("[movieService] Auth header present:", !!headers.Authorization);
    const response = await fetch(`${API_BASE_URL}/movies/user/searched`, {
      headers,
    });
    if (!response.ok) {
      console.error(
        "[movieService] Failed to fetch user movies, status:",
        response.status,
      );
      throw new Error("Failed to fetch user movies");
    }
    const data = await response.json();
    return data.data || [];
  },

  async searchMovies(query: string): Promise<Movie[]> {
    const response = await fetch(
      `${API_BASE_URL}/tmdb/search?query=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error("Failed to search movies");
    const data = await response.json();
    return data.data.results || [];
  },

  async getTrendingMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/tmdb/trending`);
    if (!response.ok) throw new Error("Failed to fetch trending movies");
    const data = await response.json();
    console.log("RAW trending response:", data);
    return data.data.results || [];
  },

  async getTopRatedMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/tmdb/top-rated?page=1`);
    if (!response.ok) throw new Error("Failed to fetch top-rated movies");
    const data = await response.json();
    return data.data.results || [];
  },

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response = await fetch(`${API_BASE_URL}/tmdb/movie/${movieId}`);
    if (!response.ok) throw new Error("Failed to fetch movie details");
    const data = await response.json();
    console.log(`RAW details response for movieId ${movieId}:`, data);
    return data.data;
  },

  async addToFavorites(
    userId: string,
    movieData: {
      movieId: number;
      title: string;
      posterPath: string;
      releaseDate: string;
      rating: number;
      summary: string;
    },
  ): Promise<{ _id: string }> {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        userId,
        ...movieData,
      }),
    });
    if (!response.ok) throw new Error("Failed to add to favorites");
    return response.json();
  },

  async removeFavorite(favoriteId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from favorites");
  },

  async addToWatched(
    userId: string,
    movieData: {
      movieId: number;
      title: string;
      posterPath: string;
      releaseDate: string;
      rating: number;
      summary: string;
      cast?: string[];
    },
  ): Promise<{ _id: string }> {
    const response = await fetch(`${API_BASE_URL}/watched`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        userId,
        ...movieData,
      }),
    });
    if (!response.ok) throw new Error("Failed to add to watched");
    return response.json();
  },

  async removeWatched(watchedId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/watched/${watchedId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from watched");
  },

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const response = await fetch(`${API_BASE_URL}/favorites/user/${userId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch favorites");
    const data = await response.json();
    return data.data || [];
  },

  async getUserWatched(userId: string): Promise<Watched[]> {
    const response = await fetch(`${API_BASE_URL}/watched/user/${userId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch watched movies");
    const data = await response.json();
    return data.data || [];
  },

  async isFavorite(userId: string, movieId: number): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/favorites/check?userId=${userId}&movieId=${movieId}`,
      { headers: getHeaders() },
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.data?.isFavorite || false;
  },

  async isWatched(userId: string, movieId: number): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/watched/check?userId=${userId}&movieId=${movieId}`,
      { headers: getHeaders() },
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.data?.isWatched || false;
  },
};
