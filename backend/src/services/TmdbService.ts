import axios from "axios";
import {
  TmdbMovie,
  TmdbCreditsResponse,
  TmdbGenreResponse,
  TmdbReviewsResponse,
  TmdbSearchResponse,
  TmdbTrendingResponse,
} from "../types";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

class TmdbService {
  async searchMovies(query: string, page: number = 1): Promise<any> {
    try {
      const response = await axios.get<TmdbSearchResponse>(
        `${TMDB_BASE_URL}/search/movie`,
        {
          params: {
            api_key: TMDB_API_KEY,
            query,
            page,
          },
        },
      );

      return {
        status: "success",
        results: response.data.results,
        totalPages: Math.ceil(response.data.results.length / 20),
      };
    } catch (error: any) {
      throw new Error(`TMDB Search Error: ${error.message}`);
    }
  }

  async getMovieDetails(movieId: number): Promise<TmdbMovie> {
    try {
      const response = await axios.get<TmdbMovie>(
        `${TMDB_BASE_URL}/movie/${movieId}`,
        {
          params: {
            api_key: TMDB_API_KEY,
            append_to_response: "credits",
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
          params: {
            api_key: TMDB_API_KEY,
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
          api_key: TMDB_API_KEY,
          page,
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
          api_key: TMDB_API_KEY,
          page,
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
          api_key: TMDB_API_KEY,
          with_genres: genreId,
          page,
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
          params: {
            api_key: TMDB_API_KEY,
          },
        },
      );
      return {
        status: "success",
        genres: response.data.genre,
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
          params: {
            api_key: TMDB_API_KEY,
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
          params: {
            api_key: TMDB_API_KEY,
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
          params: {
            api_key: TMDB_API_KEY,
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
          params: {
            api_key: TMDB_API_KEY,
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
