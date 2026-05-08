import axios from "axios";
import {
  TmdbMovie,
  TmdbCreditsResponse,
  TmdbGenreResponse,
  TmdbReviewsResponse,
  TmdbSearchResponse,
  TmdbTrendingResponse,
} from "../types";
import { getEnvironmentVariables } from "../config/environment";

const env = getEnvironmentVariables();

const TMDB_BEARER_TOKEN = env.TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = env.TMDB_BASE_URL;

class TmdbService {
  async searchMovies(query: string, page: number = 1): Promise<any> {
    console.log("Request Sent11");

    try {
      console.log("Request Sent");
      if (!TMDB_BEARER_TOKEN) {
        throw new Error("TMDB_BEARER_TOKEN not configured");
      }
      console.log("API CLEARED");
      const response = await axios.get<TmdbSearchResponse>(
        `${TMDB_BASE_URL}/search/movie`,
        {
          params: {
            query,
            page,
          },
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );
      return {
        status: "success",
        results: response.data.results,
        totalPages: response.data.results.length,
      };
    } catch (error: any) {
      console.log("======== TMDB ERROR DEBUG ========");
      console.log("Status:", error.response?.status);
      console.log("Data:", JSON.stringify(error.response?.data, null, 2));
      console.log("Params:", {
        query,
        page,
      });
      console.log("==================================");

      throw new Error(
        `TMDB Search Error: ${
          error.response?.data?.status_message || error.message
        }`,
      );
    }
  }

  async getMovieDetails(movieId: number): Promise<TmdbMovie> {
    try {
      const response = await axios.get<TmdbMovie>(
        `${TMDB_BASE_URL}/movie/${movieId}`,
        {
          params: {
            append_to_response: "credits",
          },
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`TMDB get Movie Error: ${error.message}`);
    }
  }

  async getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<any> {
    try {
      const response = await axios.get<TmdbTrendingResponse>(
        `${TMDB_BASE_URL}/trending/movie/${timeWindow}`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );
      return {
        status: "succes",
        results: (await response).data.results,
      };
    } catch (error: any) {
      throw new Error(`TMDB Trending Error: ${error.message}`);
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<any> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
        params: {
          page,
        },
        headers: {
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      });
      return {
        status: "success",
        results: response.data.results,
      };
    } catch (error: any) {
      throw new Error(`Top Rated Movie Error: ${error.message}`);
    }
  }

  async getPopularMovie(page: number = 1): Promise<any> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          page,
        },
        headers: {
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      });
      return {
        status: "success",
        results: response.data.results,
      };
    } catch (error: any) {
      throw new Error(`TMDB popular error: ${error.message}`);
    }
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<any> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          with_genres: genreId,
          page,
        },
        headers: {
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      });
      return {
        status: "success",
        results: response.data.results,
      };
    } catch (error: any) {
      throw new Error(`Genre Movie Error: ${error.message}`);
    }
  }

  async getGenres(): Promise<any> {
    try {
      const response = await axios.get<TmdbGenreResponse>(
        `${TMDB_BASE_URL}/genre/movie/list`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );
      return {
        status: "success",
        genres: response.data.genres,
      };
    } catch (error: any) {
      throw new Error(`TMDB Genres Error: ${error.message}`);
    }
  }

  async getRecommendations(movieId: number): Promise<any> {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );
      return {
        status: "success",
        results: response.data.results,
      };
    } catch (error: any) {
      throw new Error(`Recommendations Error: ${error.message} `);
    }
  }

  async getSimilarMovies(movieId: number): Promise<any> {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}/similar`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );
      return {
        status: "success",
        results: response.data.results,
      };
    } catch (error: any) {
      throw new Error(`Similar Movie Error: ${error.message} `);
    }
  }

  async getCredits(movieId: number): Promise<TmdbCreditsResponse> {
    try {
      const response = await axios.get<TmdbCreditsResponse>(
        `${TMDB_BASE_URL}/movie/${movieId}/credits`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      throw new Error(`Credits Error: ${error.message}`);
    }
  }

  async getReviews(movieId: number): Promise<TmdbReviewsResponse> {
    try {
      const response = await axios.get<TmdbReviewsResponse>(
        `${TMDB_BASE_URL}/movie/${movieId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`TMDB reviews error: ${error.message}`);
    }
  }
}

export default new TmdbService();
