import { MovieRepository } from "../../repositories";
import { describe, it, expect } from "@jest/globals";
import "../setup";

let testCounter = 0;

describe("MovieRepository", () => {
  const timestamp = Date.now();

  describe("create", () => {
    it("should create a new movie successfully", async () => {
      const uid = `${timestamp}_${++testCounter}`;
      const movieData = {
        movieId: `${1000 + testCounter}`,
        title: `Test Movie ${uid}`,
        summary: "A test movie",
        releaseDate: new Date("2020-01-15"),
        genres: ["Action", "Drama"],
        cast: ["Actor 1"],
        director: "Director",
        rating: 8.5,
      };

      const movie = await MovieRepository.create(movieData);

      expect(movie).toBeDefined();
      expect(movie.title).toBe(movieData.title);
      expect(movie.movieId).toBe(movieData.movieId);
    });
  });

  describe("findByMovieId", () => {
    it("should find movie by movieId", async () => {
      const movieId = `${2000 + testCounter}`;
      const movieData = {
        movieId,
        title: `Movie ${timestamp}`,
        summary: "Test",
        releaseDate: new Date("2021-01-01"),
        genres: ["Drama"],
        cast: [],
        director: "Director",
        rating: 7.0,
      };
      await MovieRepository.create(movieData);

      const movie = await MovieRepository.findByMovieId(movieId);

      expect(movie).toBeDefined();
      expect(movie?.movieId).toBe(movieId);
    });

    it("should return null when movie not found", async () => {
      const movie = await MovieRepository.findByMovieId("999999");

      expect(movie).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all movies", async () => {
      const movies = await MovieRepository.findAll();

      expect(Array.isArray(movies)).toBe(true);
    });
  });

  describe("update", () => {
    it("should update movie successfully", async () => {
      const movieId = `${3000 + testCounter}`;
      const movieData = {
        movieId,
        title: `Original`,
        summary: "Original summary",
        releaseDate: new Date("2020-01-01"),
        genres: ["Action"],
        cast: ["Actor"],
        director: "Director",
        rating: 7.0,
      };
      await MovieRepository.create(movieData);

      const updated = await MovieRepository.update(movieId, {
        title: `Updated`,
        rating: 8.5,
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe("Updated");
      expect(updated?.rating).toBe(8.5);
    });
  });

  describe("delete", () => {
    it("should delete movie successfully", async () => {
      const movieId = `${4000 + testCounter}`;
      const movieData = {
        movieId,
        title: `Delete`,
        summary: "To be deleted",
        releaseDate: new Date("2020-01-01"),
        genres: ["Comedy"],
        cast: [],
        director: "Director",
        rating: 6.0,
      };
      await MovieRepository.create(movieData);

      const deleted = await MovieRepository.delete(movieId);

      expect(deleted).toBe(true);
      const found = await MovieRepository.findByMovieId(movieId);
      expect(found).toBeNull();
    });

    it("should return false when movie not found", async () => {
      const deleted = await MovieRepository.delete("999999");

      expect(deleted).toBe(false);
    });
  });

  describe("findByGenre", () => {
    it("should find movies by genre", async () => {
      const movies = await MovieRepository.findByGenre("Action");

      expect(Array.isArray(movies)).toBe(true);
    });
  });

  describe("findByDirector", () => {
    it("should find movies by director", async () => {
      const movies = await MovieRepository.findByDirector("Director");

      expect(Array.isArray(movies)).toBe(true);
    });
  });

  describe("findByReleaseYear", () => {
    it("should find movies by release year", async () => {
      const movies = await MovieRepository.findByReleaseYear(2020);

      expect(Array.isArray(movies)).toBe(true);
    });
  });

  describe("searchByTitle", () => {
    it("should search movies by title (case insensitive)", async () => {
      const movies = await MovieRepository.searchByTitle("test");

      expect(Array.isArray(movies)).toBe(true);
    });
  });

  describe("findByTitle", () => {
    it("should find movie by exact title", async () => {
      const title = `Exact Title ${timestamp}`;
      const movieData = {
        movieId: `${9000 + testCounter}`,
        title,
        summary: "Test",
        releaseDate: new Date("2020-01-01"),
        genres: ["Animation"],
        cast: [],
        director: "Director",
        rating: 7.0,
      };
      await MovieRepository.create(movieData);

      const movie = await MovieRepository.findByTitle(title);

      expect(movie).toBeDefined();
      expect(movie?.title).toBe(title);
    });

    it("should return null when title not found", async () => {
      const movie = await MovieRepository.findByTitle(
        "Nonexistent Movie Title 123456",
      );

      expect(movie).toBeNull();
    });
  });
});
