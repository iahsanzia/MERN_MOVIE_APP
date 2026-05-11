import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock axios before importing TmdbService
jest.mock("axios");
import axios from "axios";
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { TmdbService } from "../../services";

describe("TmdbService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchMovies", () => {
    it("should search movies successfully", async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: "Movie 1", poster_path: "/path1" },
            { id: 2, title: "Movie 2", poster_path: "/path2" },
          ],
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.searchMovies("Inception", 1);

      expect(result.status).toBe("success");
      expect(result.results).toHaveLength(2);
      expect(result.results[0].title).toBe("Movie 1");
    });

    it("should use default page value of 1", async () => {
      const mockResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await TmdbService.searchMovies("Avatar");

      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should throw error when API fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("API request failed"));

      await expect(TmdbService.searchMovies("Test")).rejects.toThrow(
        "TMDB Search Error",
      );
    });

    it("should handle search with pagination", async () => {
      const mockResponse = { data: { results: [{ id: 1, title: "Movie" }] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.searchMovies("Test", 2);

      expect(result.status).toBe("success");
      expect(result.results).toBeDefined();
    });
  });

  describe("getMovieDetails", () => {
    it("should fetch movie details successfully", async () => {
      const mockResponse = {
        data: {
          id: 550,
          title: "Fight Club",
          overview: "An insomniac office worker...",
          credits: {
            cast: [{ id: 1, name: "Brad Pitt" }],
          },
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getMovieDetails(550);

      expect(result.title).toBe("Fight Club");
      expect(result.id).toBe(550);
    });

    it("should throw error when movie not found", async () => {
      mockedAxios.get.mockRejectedValue(new Error("404 Not Found"));

      await expect(TmdbService.getMovieDetails(999999)).rejects.toThrow(
        "TMDB get Movie Error",
      );
    });
  });

  describe("getTrendingMovies", () => {
    it("should fetch trending movies for week by default", async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: "Trending 1" },
            { id: 2, title: "Trending 2" },
          ],
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getTrendingMovies();

      expect(result.results).toHaveLength(2);
    });

    it("should fetch trending movies for day when specified", async () => {
      const mockResponse = {
        data: { results: [{ id: 1, title: "Trending" }] },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getTrendingMovies("day");

      expect(result.results).toBeDefined();
    });

    it("should throw error when API fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      await expect(TmdbService.getTrendingMovies()).rejects.toThrow(
        "TMDB Trending Error",
      );
    });
  });

  describe("getTopRatedMovies", () => {
    it("should fetch top rated movies successfully", async () => {
      const mockResponse = {
        data: {
          results: [{ id: 1, title: "Top Movie 1", vote_average: 9.0 }],
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getTopRatedMovies(1);

      expect(result.status).toBe("success");
      expect(result.results).toHaveLength(1);
    });

    it("should use default page value of 1", async () => {
      const mockResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getTopRatedMovies();

      expect(result.status).toBe("success");
    });

    it("should throw error when API fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Server error"));

      await expect(TmdbService.getTopRatedMovies()).rejects.toThrow(
        "Top Rated Movie Error",
      );
    });
  });

  describe("getPopularMovie", () => {
    it("should fetch popular movies successfully", async () => {
      const mockResponse = {
        data: {
          results: [{ id: 1, title: "Popular Movie 1", popularity: 100 }],
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getPopularMovie(1);

      expect(result.status).toBe("success");
      expect(result.results).toHaveLength(1);
    });

    it("should use default page value of 1", async () => {
      const mockResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getPopularMovie();

      expect(result.status).toBe("success");
    });

    it("should throw error when API fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Connection timeout"));

      await expect(TmdbService.getPopularMovie()).rejects.toThrow(
        "TMDB popular error",
      );
    });
  });

  describe("getMoviesByGenre", () => {
    it("should fetch movies by genre successfully", async () => {
      const mockResponse = {
        data: {
          results: [{ id: 1, title: "Action Movie", genres: [28] }],
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getMoviesByGenre(28, 1);

      expect(result.status).toBe("success");
      expect(result.results).toHaveLength(1);
    });

    it("should use default page value of 1", async () => {
      const mockResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getMoviesByGenre(35);

      expect(result.status).toBe("success");
    });

    it("should throw error when API fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Genre fetch failed"));

      await expect(TmdbService.getMoviesByGenre(28)).rejects.toThrow(
        "Genre Movie Error",
      );
    });
  });

  describe("getGenres", () => {
    it("should fetch genres successfully", async () => {
      const mockResponse = {
        data: {
          genres: [
            { id: 28, name: "Action" },
            { id: 35, name: "Comedy" },
          ],
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getGenres();

      expect(result.status).toBe("success");
      expect(result.genres).toHaveLength(2);
      expect(result.genres[0].name).toBe("Action");
    });

    it("should throw error when API fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Genres fetch failed"));

      await expect(TmdbService.getGenres()).rejects.toThrow(
        "TMDB Genres Error",
      );
    });
  });

  describe("getLanguages", () => {
    it("should fetch languages successfully", async () => {
      const mockResponse = {
        data: [
          { iso_639_1: "en", english_name: "English" },
          { iso_639_1: "es", english_name: "Spanish" },
        ],
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await TmdbService.getLanguages();

      expect(result.status).toBe("success");
      expect(result.languages).toHaveLength(2);
    });

    it("should throw error when API fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Languages fetch failed"));

      await expect(TmdbService.getLanguages()).rejects.toThrow(
        "TMDB Languages Error",
      );
    });
  });
});
