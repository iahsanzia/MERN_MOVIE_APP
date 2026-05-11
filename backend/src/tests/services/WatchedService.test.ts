import { WatchedService } from "../../services";
import { UserService } from "../../services";
import { describe, it, expect } from "@jest/globals";
import mongoose from "mongoose";
import "../setup";

let testCounter = 0;

describe("WatchedService", () => {
  const timestamp = Date.now();
  let userId: string;

  // Setup: Create a test user before each test
  async function setupTestUser() {
    const uid = `${timestamp}_${++testCounter}`;
    const result = await UserService.register(
      `watched_user_${uid}`,
      `watched_${uid}@example.com`,
      "Password123",
    );
    return result.user._id.toString();
  }

  describe("addToWatched", () => {
    it("should add a movie to watched list successfully", async () => {
      userId = await setupTestUser();
      const movieId = 550;
      const movieData = {
        title: "Fight Club",
        summary:
          "An insomniac office worker and a devil-may-care soapmaker form an underground fight club.",
        releaseDate: new Date("1999-10-15"),
        genres: ["Drama", "Thriller"],
        cast: ["Brad Pitt", "Edward Norton"],
        rating: 8.8,
        posterPath: "/fight_club.jpg",
      };

      const watched = await WatchedService.addToWatched(
        userId,
        movieId,
        movieData,
      );

      expect(watched).toBeDefined();
      expect(watched.userId.toString()).toBe(userId);
      expect(watched.movieId).toBe(movieId);
      expect(watched.title).toBe(movieData.title);
      expect(watched.genres).toEqual(movieData.genres);
      expect(watched.WatchedAt).toBeDefined();
    });

    it("should throw error when adding duplicate movie to watched", async () => {
      userId = await setupTestUser();
      const movieId = 278;
      const movieData = {
        title: "The Shawshank Redemption",
        summary: "Two imprisoned men bond over a number of years.",
        releaseDate: new Date("1994-10-14"),
        genres: ["Drama"],
        cast: ["Tim Robbins", "Morgan Freeman"],
        rating: 9.3,
        posterPath: "/shawshank.jpg",
      };

      await WatchedService.addToWatched(userId, movieId, movieData);

      await expect(
        WatchedService.addToWatched(userId, movieId, movieData),
      ).rejects.toThrow("Movie is already in watched list");
    });

    it("should convert userId to ObjectId and set WatchedAt timestamp", async () => {
      userId = await setupTestUser();
      const movieId = 419;
      const movieData = {
        title: "The Fifth Element",
        summary:
          "In the future, a cab driver unwittingly becomes key to saving the world.",
        releaseDate: new Date("1997-05-09"),
        genres: ["Action", "Sci-Fi"],
        cast: ["Bruce Willis", "Milla Jovovich"],
        rating: 7.7,
        posterPath: "/fifth.jpg",
      };

      const before = new Date();
      const watched = await WatchedService.addToWatched(
        userId,
        movieId,
        movieData,
      );
      const after = new Date();

      expect(watched.userId).toEqual(new mongoose.Types.ObjectId(userId));
      expect(watched.WatchedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(watched.WatchedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("getWatchedByUserId", () => {
    it("should return all watched movies for a user", async () => {
      userId = await setupTestUser();

      const movie1Data = {
        title: "Inception",
        summary: "A thief who steals corporate secrets.",
        releaseDate: new Date("2010-07-16"),
        genres: ["Action", "Sci-Fi"],
        cast: ["Leonardo DiCaprio"],
        rating: 8.8,
        posterPath: "/inception.jpg",
      };
      const movie2Data = {
        title: "The Matrix",
        summary: "A computer hacker learns from mysterious rebels.",
        releaseDate: new Date("1999-03-31"),
        genres: ["Action", "Sci-Fi"],
        cast: ["Keanu Reeves"],
        rating: 8.7,
        posterPath: "/matrix.jpg",
      };

      await WatchedService.addToWatched(userId, 27205, movie1Data);
      await WatchedService.addToWatched(userId, 603, movie2Data);

      const watched = await WatchedService.getWatchedByUserId(userId);

      expect(watched).toHaveLength(2);
      expect(watched[0]?.title).toBe("Inception");
      expect(watched[1]?.title).toBe("The Matrix");
    });

    it("should return empty array when user has not watched any movies", async () => {
      userId = await setupTestUser();

      const watched = await WatchedService.getWatchedByUserId(userId);

      expect(watched).toEqual([]);
    });
  });

  describe("isWatched", () => {
    it("should return true if movie is watched", async () => {
      userId = await setupTestUser();
      const movieId = 550;
      const movieData = {
        title: "Fight Club",
        summary: "Underground fight club story.",
        releaseDate: new Date("1999-10-15"),
        genres: ["Drama"],
        cast: ["Brad Pitt"],
        rating: 8.8,
        posterPath: "/fight.jpg",
      };

      await WatchedService.addToWatched(userId, movieId, movieData);

      const isWatched = await WatchedService.isWatched(userId, movieId);

      expect(isWatched).toBe(true);
    });

    it("should return false if movie is not watched", async () => {
      userId = await setupTestUser();

      const isWatched = await WatchedService.isWatched(userId, 999);

      expect(isWatched).toBe(false);
    });
  });

  describe("removeFromWatched", () => {
    it("should remove a movie from watched list", async () => {
      userId = await setupTestUser();
      const movieId = 278;
      const movieData = {
        title: "The Shawshank Redemption",
        summary: "Two imprisoned men bond.",
        releaseDate: new Date("1994-10-14"),
        genres: ["Drama"],
        cast: ["Tim Robbins"],
        rating: 9.3,
        posterPath: "/shawshank.jpg",
      };

      await WatchedService.addToWatched(userId, movieId, movieData);

      const result = await WatchedService.removeFromWatched(userId, movieId);

      expect(result).toBe(true);

      const isWatched = await WatchedService.isWatched(userId, movieId);
      expect(isWatched).toBe(false);
    });

    it("should throw error when removing non-existent watched entry", async () => {
      userId = await setupTestUser();

      await expect(
        WatchedService.removeFromWatched(userId, 999),
      ).rejects.toThrow("Watched entry not found");
    });
  });

  describe("getUserWatchedCount", () => {
    it("should return correct watched count for user", async () => {
      userId = await setupTestUser();

      const movieData1 = {
        title: "Movie 1",
        summary: "Summary 1",
        releaseDate: new Date("2020-01-01"),
        genres: ["Drama"],
        cast: ["Actor 1"],
        rating: 8.0,
        posterPath: "/m1.jpg",
      };
      const movieData2 = {
        title: "Movie 2",
        summary: "Summary 2",
        releaseDate: new Date("2021-01-01"),
        genres: ["Action"],
        cast: ["Actor 2"],
        rating: 8.5,
        posterPath: "/m2.jpg",
      };

      await WatchedService.addToWatched(userId, 1, movieData1);
      await WatchedService.addToWatched(userId, 2, movieData2);

      const count = await WatchedService.getUserWatchedCount(userId);

      expect(count).toBe(2);
    });

    it("should return 0 for user with no watched movies", async () => {
      userId = await setupTestUser();

      const count = await WatchedService.getUserWatchedCount(userId);

      expect(count).toBe(0);
    });
  });

  describe("getUserRecentlyWatched", () => {
    it("should return recently watched movies sorted by date", async () => {
      userId = await setupTestUser();

      const movie1Data = {
        title: "Old Movie",
        summary: "Watched long ago",
        releaseDate: new Date("2000-01-01"),
        genres: ["Drama"],
        cast: ["Actor"],
        rating: 8.0,
        posterPath: "/old.jpg",
      };
      const movie2Data = {
        title: "Recent Movie",
        summary: "Watched recently",
        releaseDate: new Date("2023-01-01"),
        genres: ["Action"],
        cast: ["Actor"],
        rating: 8.5,
        posterPath: "/recent.jpg",
      };

      await WatchedService.addToWatched(userId, 1, movie1Data);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await WatchedService.addToWatched(userId, 2, movie2Data);

      const recent = await WatchedService.getUserRecentlyWatched(userId, 10);

      expect(recent).toHaveLength(2);
      expect(recent[0]?.title).toBe("Recent Movie");
      expect(recent[1]?.title).toBe("Old Movie");
    });

    it("should respect limit parameter", async () => {
      userId = await setupTestUser();

      for (let i = 1; i <= 5; i++) {
        const movieData = {
          title: `Movie ${i}`,
          summary: `Movie ${i} summary`,
          releaseDate: new Date(`202${i}-01-01`),
          genres: ["Drama"],
          cast: ["Actor"],
          rating: 8.0,
          posterPath: `/m${i}.jpg`,
        };
        await WatchedService.addToWatched(userId, i, movieData);
      }

      const recent = await WatchedService.getUserRecentlyWatched(userId, 2);

      expect(recent).toHaveLength(2);
    });
  });

  describe("getTopWatchedMovies", () => {
    it("should return top watched movies by count", async () => {
      // Create multiple users watching the same movies
      const user1 = await setupTestUser();
      const user2 = await setupTestUser();
      const user3 = await setupTestUser();

      const movieData = {
        title: "Popular Movie",
        summary: "Very popular",
        releaseDate: new Date("2020-01-01"),
        genres: ["Action"],
        cast: ["Actor"],
        rating: 9.0,
        posterPath: "/popular.jpg",
      };

      // Movie ID 100 watched by 3 users
      await WatchedService.addToWatched(user1, 100, movieData);
      await WatchedService.addToWatched(user2, 100, movieData);
      await WatchedService.addToWatched(user3, 100, movieData);

      // Movie ID 101 watched by 1 user
      await WatchedService.addToWatched(user1, 101, movieData);

      const topMovies = await WatchedService.getTopWatchedMovies(5);

      expect(topMovies).toBeDefined();
      expect(topMovies.length).toBeGreaterThan(0);
      // Most watched should be first
      expect(topMovies[0]?.movieId).toBe(100);
      expect(topMovies[0]?.count).toBe(3);
    });
  });
});
