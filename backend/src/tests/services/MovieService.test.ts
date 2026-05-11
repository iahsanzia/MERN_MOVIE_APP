import { MovieService } from "../../services";
import { describe, it, expect, afterEach } from "@jest/globals";
import mongoose from "mongoose";
import "../setup";

describe("MovieService", () => {
  const timestamp = Date.now();

  afterEach(async () => {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        if (collection) {
          await collection.deleteMany({});
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Cleanup error:`, error);
    }
  });

  describe("createMovie", () => {
    it("should create a new movie successfully", async () => {
      const movieData = {
        movieId: `movie_${timestamp}_1`,
        title: "The Shawshank Redemption",
        summary: "A story of hope and friendship",
        releaseDate: new Date("1994-10-14"),
        genres: ["Drama"],
        director: "Frank Darabont",
        cast: ["Tim Robbins", "Morgan Freeman"],
        rating: 9.3,
      };

      const movie = await MovieService.createMovie(movieData);

      expect(movie).toBeDefined();
      expect(movie.movieId).toBe(movieData.movieId);
      expect(movie.title).toBe(movieData.title);
      expect(movie.director).toBe(movieData.director);
      expect(movie.rating).toBe(movieData.rating);
    });

    it("should throw error if duplicate movieId", async () => {
      const movieId = `movie_${timestamp}_dup`;
      const movieData = {
        movieId,
        title: "Movie 1",
        summary: "Summary 1",
        releaseDate: new Date("2020-01-01"),
        genres: ["Action"],
        director: "Director 1",
        cast: ["Actor 1"],
        rating: 8.0,
      };

      await MovieService.createMovie(movieData);

      await expect(
        MovieService.createMovie({
          ...movieData,
          title: "Different Title",
        }),
      ).rejects.toThrow("Movie with this ID already exists");
    });

    it("should store genres as an array", async () => {
      const movieData = {
        movieId: `movie_${timestamp}_genres`,
        title: "Multi-Genre Movie",
        summary: "A movie with multiple genres",
        releaseDate: new Date("2021-06-15"),
        genres: ["Action", "Drama", "Thriller"],
        director: "Test Director",
        cast: [],
        rating: 7.5,
      };

      const movie = await MovieService.createMovie(movieData);

      expect(movie.genres).toEqual(["Action", "Drama", "Thriller"]);
      expect(movie.genres.length).toBe(3);
    });

    it("should store cast as an array", async () => {
      const movieData = {
        movieId: `movie_${timestamp}_cast`,
        title: "Movie with Cast",
        summary: "A movie with cast members",
        releaseDate: new Date("2022-03-20"),
        genres: ["Comedy"],
        director: "Test Director",
        cast: ["Actor 1", "Actor 2", "Actor 3"],
        rating: 6.8,
      };

      const movie = await MovieService.createMovie(movieData);

      expect(movie.cast).toEqual(["Actor 1", "Actor 2", "Actor 3"]);
      expect(movie.cast.length).toBe(3);
    });
  });

  describe("getMovieById", () => {
    it("should get movie by ID", async () => {
      const movieId = `movie_${timestamp}_getbyid`;
      const movieData = {
        movieId,
        title: "Get By ID Movie",
        summary: "Test summary",
        releaseDate: new Date("2020-05-10"),
        genres: ["Drama"],
        director: "Test Director",
        cast: ["Actor 1"],
        rating: 7.0,
      };

      await MovieService.createMovie(movieData);
      const movie = await MovieService.getMovieById(movieId);

      expect(movie).toBeDefined();
      expect(movie?.title).toBe("Get By ID Movie");
      expect(movie?.director).toBe("Test Director");
    });

    it("should return null if movie not found", async () => {
      const movie = await MovieService.getMovieById("nonexistent_movie");

      expect(movie).toBeNull();
    });
  });

  describe("getAllMovies", () => {
    it("should return empty array when no movies exist", async () => {
      const movies = await MovieService.getAllMovies();

      expect(movies).toEqual([]);
    });

    it("should return all movies", async () => {
      const movieIds = [
        `movie_${timestamp}_1`,
        `movie_${timestamp}_2`,
        `movie_${timestamp}_3`,
      ];

      for (let i = 0; i < movieIds.length; i++) {
        await MovieService.createMovie({
          movieId: movieIds[i]!,
          title: `Movie ${i + 1}`,
          summary: `Summary ${i + 1}`,
          releaseDate: new Date(),
          genres: ["Action"],
          director: "Director",
          cast: [],
          rating: 7.0,
        });
      }

      const movies = await MovieService.getAllMovies();

      expect(movies.length).toBe(3);
    });
  });

  describe("searchMoviesByTitle", () => {
    beforeEach(async () => {
      await MovieService.createMovie({
        movieId: `movie_${timestamp}_search1`,
        title: "The Matrix",
        summary: "A sci-fi movie",
        releaseDate: new Date("1999-03-31"),
        genres: ["Sci-Fi", "Action"],
        director: "The Wachowskis",
        cast: ["Keanu Reeves"],
        rating: 8.7,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_search2`,
        title: "Matrix Reloaded",
        summary: "Sequel to The Matrix",
        releaseDate: new Date("2003-05-15"),
        genres: ["Sci-Fi", "Action"],
        director: "The Wachowskis",
        cast: ["Keanu Reeves"],
        rating: 7.2,
      });
    });

    it("should search movies by title", async () => {
      const movies = await MovieService.searchMoviesByTitle("Matrix");

      expect(movies.length).toBeGreaterThan(0);
      expect(movies.some((m) => m.title.includes("Matrix"))).toBe(true);
    });

    it("should throw error if title is empty", async () => {
      await expect(MovieService.searchMoviesByTitle("")).rejects.toThrow(
        "Title is required for searching movies",
      );
    });

    it("should throw error if title is whitespace only", async () => {
      await expect(MovieService.searchMoviesByTitle("   ")).rejects.toThrow(
        "Title is required for searching movies",
      );
    });
  });

  describe("getMoviesByGenre", () => {
    beforeEach(async () => {
      await MovieService.createMovie({
        movieId: `movie_${timestamp}_action1`,
        title: "Action Movie 1",
        summary: "Action film",
        releaseDate: new Date("2020-01-01"),
        genres: ["Action", "Thriller"],
        director: "Director A",
        cast: [],
        rating: 7.5,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_action2`,
        title: "Action Movie 2",
        summary: "Another action film",
        releaseDate: new Date("2021-02-02"),
        genres: ["Action"],
        director: "Director B",
        cast: [],
        rating: 7.8,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_drama`,
        title: "Drama Movie",
        summary: "A drama film",
        releaseDate: new Date("2022-03-03"),
        genres: ["Drama"],
        director: "Director C",
        cast: [],
        rating: 8.2,
      });
    });

    it("should get movies by genre", async () => {
      const movies = await MovieService.getMoviesByGenre("Action");

      expect(movies.length).toBe(2);
      expect(movies.every((m) => m.genres.includes("Action"))).toBe(true);
    });

    it("should throw error if genre is empty", async () => {
      await expect(MovieService.getMoviesByGenre("")).rejects.toThrow(
        "Genre is required for searching movies",
      );
    });
  });

  describe("getMoviesByDirector", () => {
    beforeEach(async () => {
      await MovieService.createMovie({
        movieId: `movie_${timestamp}_dir1`,
        title: "Christopher Nolan Film 1",
        summary: "Film by Nolan",
        releaseDate: new Date("2010-07-16"),
        genres: ["Sci-Fi"],
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio"],
        rating: 8.8,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_dir2`,
        title: "Christopher Nolan Film 2",
        summary: "Another Nolan film",
        releaseDate: new Date("2020-11-21"),
        genres: ["Drama", "War"],
        director: "Christopher Nolan",
        cast: ["Cillian Murphy"],
        rating: 8.1,
      });
    });

    it("should get movies by director", async () => {
      const movies =
        await MovieService.getMoviesByDirector("Christopher Nolan");

      expect(movies.length).toBe(2);
      expect(movies.every((m) => m.director === "Christopher Nolan")).toBe(
        true,
      );
    });

    it("should throw error if director is empty", async () => {
      await expect(MovieService.getMoviesByDirector("")).rejects.toThrow(
        "Director is required for searching movies",
      );
    });
  });

  describe("getMoviesByReleaseYear", () => {
    beforeEach(async () => {
      await MovieService.createMovie({
        movieId: `movie_${timestamp}_year1`,
        title: "2020 Movie",
        summary: "Released in 2020",
        releaseDate: new Date("2020-06-01"),
        genres: ["Action"],
        director: "Director A",
        cast: [],
        rating: 7.0,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_year2`,
        title: "2020 Another Movie",
        summary: "Another 2020 movie",
        releaseDate: new Date("2020-12-25"),
        genres: ["Comedy"],
        director: "Director B",
        cast: [],
        rating: 6.5,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_year3`,
        title: "2021 Movie",
        summary: "Released in 2021",
        releaseDate: new Date("2021-05-15"),
        genres: ["Drama"],
        director: "Director C",
        cast: [],
        rating: 8.0,
      });
    });

    it("should get movies by release year", async () => {
      const movies = await MovieService.getMoviesByReleaseYear(2020);

      expect(movies.length).toBe(2);
      expect(movies.every((m) => m.releaseDate.getFullYear() === 2020)).toBe(
        true,
      );
    });

    it("should throw error if year is before 1888", async () => {
      await expect(MovieService.getMoviesByReleaseYear(1800)).rejects.toThrow(
        "Valid release year is required for searching movies",
      );
    });

    it("should throw error if year is in the future", async () => {
      const futureYear = new Date().getFullYear() + 1;
      await expect(
        MovieService.getMoviesByReleaseYear(futureYear),
      ).rejects.toThrow("Valid release year is required for searching movies");
    });
  });

  describe("updateMovie", () => {
    let movieId: string;

    beforeEach(async () => {
      movieId = `movie_${timestamp}_update`;
      await MovieService.createMovie({
        movieId,
        title: "Original Title",
        summary: "Original summary",
        releaseDate: new Date("2020-01-01"),
        genres: ["Action"],
        director: "Original Director",
        cast: ["Actor 1"],
        rating: 7.0,
      });
    });

    it("should update movie successfully", async () => {
      const updated = await MovieService.updateMovie(movieId, {
        title: "Updated Title",
        rating: 8.5,
      });

      expect(updated?.title).toBe("Updated Title");
      expect(updated?.rating).toBe(8.5);
    });

    it("should throw error if movie not found", async () => {
      await expect(
        MovieService.updateMovie("nonexistent_movie", { title: "New Title" }),
      ).rejects.toThrow("Movie not found");
    });
  });

  describe("deleteMovie", () => {
    let movieId: string;

    beforeEach(async () => {
      movieId = `movie_${timestamp}_delete`;
      await MovieService.createMovie({
        movieId,
        title: "Movie to Delete",
        summary: "This movie will be deleted",
        releaseDate: new Date("2020-01-01"),
        genres: ["Drama"],
        director: "Director",
        cast: [],
        rating: 7.5,
      });
    });

    it("should delete movie successfully", async () => {
      const result = await MovieService.deleteMovie(movieId);

      expect(result).toBe(true);

      const deletedMovie = await MovieService.getMovieById(movieId);
      expect(deletedMovie).toBeNull();
    });

    it("should throw error if movie not found", async () => {
      await expect(
        MovieService.deleteMovie("nonexistent_movie"),
      ).rejects.toThrow("Movie not found");
    });
  });

  describe("getMovieByTitle", () => {
    beforeEach(async () => {
      await MovieService.createMovie({
        movieId: `movie_${timestamp}_bytitle`,
        title: "Unique Movie Title",
        summary: "A unique movie",
        releaseDate: new Date("2021-01-01"),
        genres: ["Thriller"],
        director: "Director X",
        cast: ["Actor Y"],
        rating: 7.8,
      });
    });

    it("should get movie by exact title", async () => {
      const movie = await MovieService.getMovieByTitle("Unique Movie Title");

      expect(movie).toBeDefined();
      expect(movie?.title).toBe("Unique Movie Title");
    });

    it("should return null if title not found", async () => {
      const movie = await MovieService.getMovieByTitle("Nonexistent Title");

      expect(movie).toBeNull();
    });

    it("should throw error if title is empty", async () => {
      await expect(MovieService.getMovieByTitle("")).rejects.toThrow(
        "Title is required for searching movies",
      );
    });
  });

  describe("getFilteredMovies", () => {
    beforeEach(async () => {
      await MovieService.createMovie({
        movieId: `movie_${timestamp}_filter1`,
        title: "Action Thriller 2020",
        summary: "An action thriller",
        releaseDate: new Date("2020-06-01"),
        genres: ["Action", "Thriller"],
        director: "Nolan",
        cast: [],
        rating: 8.5,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_filter2`,
        title: "Drama Film 2021",
        summary: "A drama film",
        releaseDate: new Date("2021-03-15"),
        genres: ["Drama"],
        director: "Scorsese",
        cast: [],
        rating: 7.2,
      });

      await MovieService.createMovie({
        movieId: `movie_${timestamp}_filter3`,
        title: "Action Movie 2021",
        summary: "Another action movie",
        releaseDate: new Date("2021-07-20"),
        genres: ["Action"],
        director: "Nolan",
        cast: [],
        rating: 6.8,
      });
    });

    it("should filter movies by genre", async () => {
      const movies = await MovieService.getFilteredMovies("Action");

      expect(movies.length).toBeGreaterThan(0);
      expect(movies.every((m) => m.genres.includes("Action"))).toBe(true);
    });

    it("should filter movies by director", async () => {
      const movies = await MovieService.getFilteredMovies(undefined, "Nolan");

      expect(movies.length).toBe(2);
      expect(movies.every((m) => m.director === "Nolan")).toBe(true);
    });

    it("should filter movies by release year", async () => {
      const movies = await MovieService.getFilteredMovies(
        undefined,
        undefined,
        2020,
      );

      expect(movies.length).toBe(1);
      expect(movies[0]?.releaseDate.getFullYear()).toBe(2020);
    });

    it("should filter movies by max rating", async () => {
      const movies = await MovieService.getFilteredMovies(
        undefined,
        undefined,
        undefined,
        7.0,
      );

      expect(movies.every((m) => m.rating <= 7.0)).toBe(true);
    });

    it("should filter movies by min rating", async () => {
      const movies = await MovieService.getFilteredMovies(
        undefined,
        undefined,
        undefined,
        undefined,
        8.0,
      );

      expect(movies.every((m) => m.rating >= 8.0)).toBe(true);
    });

    it("should combine multiple filters", async () => {
      const movies = await MovieService.getFilteredMovies(
        "Action",
        "Nolan",
        2020,
      );

      expect(movies.length).toBe(1);
      expect(movies[0]?.title).toBe("Action Thriller 2020");
    });

    it("should return all movies when no filters applied", async () => {
      const movies = await MovieService.getFilteredMovies();

      expect(movies.length).toBe(3);
    });
  });
});
