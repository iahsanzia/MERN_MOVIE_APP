import { FavoriteService } from "../../services";
import { UserService } from "../../services";
import { describe, it, expect } from "@jest/globals";
import mongoose from "mongoose";
import "../setup";

let testCounter = 0;

describe("FavoriteService", () => {
  const timestamp = Date.now();
  let userId: string;

  // Setup: Create a test user before each test
  async function setupTestUser() {
    const uid = `${timestamp}_${++testCounter}`;
    const result = await UserService.register(
      `fav_user_${uid}`,
      `fav_${uid}@example.com`,
      "Password123",
    );
    return result.user._id.toString();
  }

  describe("addToFavorites", () => {
    it("should add a movie to favorites successfully", async () => {
      userId = await setupTestUser();
      const movieId = 550;
      const movieData = {
        title: "Fight Club",
        posterPath: "/poster.jpg",
        releaseDate: "1999-10-15",
        rating: 8.8,
        summary:
          "An insomniac office worker and a devil-may-care soapmaker form an underground fight club.",
      };

      const favorite = await FavoriteService.addToFavorites(
        userId,
        movieId,
        movieData,
      );

      expect(favorite).toBeDefined();
      expect(favorite.userId.toString()).toBe(userId);
      expect(favorite.movieId).toBe(movieId);
      expect(favorite.title).toBe(movieData.title);
      expect(favorite.posterPath).toBe(movieData.posterPath);
      expect(favorite.addedAt).toBeDefined();
    });

    it("should throw error when adding duplicate movie to favorites", async () => {
      userId = await setupTestUser();
      const movieId = 278;
      const movieData = {
        title: "The Shawshank Redemption",
        posterPath: "/shawshank.jpg",
        releaseDate: "1994-10-14",
        rating: 9.3,
        summary: "A story of hope and friendship.",
      };

      await FavoriteService.addToFavorites(userId, movieId, movieData);

      await expect(
        FavoriteService.addToFavorites(userId, movieId, movieData),
      ).rejects.toThrow("Movie is already in favorites");
    });

    it("should convert userId to ObjectId", async () => {
      userId = await setupTestUser();
      const movieId = 419;
      const movieData = {
        title: "The Fifth Element",
        posterPath: "/fifth.jpg",
        releaseDate: "1997-05-09",
        rating: 7.7,
        summary:
          "In the future, a cab driver unwittingly becomes key to saving the world.",
      };

      const favorite = await FavoriteService.addToFavorites(
        userId,
        movieId,
        movieData,
      );

      expect(favorite.userId).toEqual(new mongoose.Types.ObjectId(userId));
    });

    it("should set addedAt timestamp", async () => {
      userId = await setupTestUser();
      const movieId = 680;
      const movieData = {
        title: "Pulp Fiction",
        posterPath: "/pulp.jpg",
        releaseDate: "1994-10-14",
        rating: 8.9,
        summary: "The lives of two mob hitmen intertwine.",
      };

      const before = new Date();
      const favorite = await FavoriteService.addToFavorites(
        userId,
        movieId,
        movieData,
      );
      const after = new Date();

      expect(favorite.addedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(favorite.addedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("getFavoritesByUserId", () => {
    it("should return all favorites for a user", async () => {
      userId = await setupTestUser();

      const movie1Data = {
        title: "Inception",
        posterPath: "/inception.jpg",
        releaseDate: "2010-07-16",
        rating: 8.8,
      };
      const movie2Data = {
        title: "The Matrix",
        posterPath: "/matrix.jpg",
        releaseDate: "1999-03-31",
        rating: 8.7,
      };

      await FavoriteService.addToFavorites(userId, 27205, movie1Data);
      await FavoriteService.addToFavorites(userId, 603, movie2Data);

      const favorites = await FavoriteService.getFavoritesByUserId(userId);

      expect(favorites).toHaveLength(2);
      expect(favorites[0]?.title).toBe("Inception");
      expect(favorites[1]?.title).toBe("The Matrix");
    });

    it("should return empty array when user has no favorites", async () => {
      userId = await setupTestUser();

      const favorites = await FavoriteService.getFavoritesByUserId(userId);

      expect(favorites).toEqual([]);
    });
  });

  describe("isFavorite", () => {
    it("should return true if movie is in favorites", async () => {
      userId = await setupTestUser();
      const movieId = 550;
      const movieData = {
        title: "Fight Club",
        posterPath: "/poster.jpg",
        releaseDate: "1999-10-15",
        rating: 8.8,
      };

      await FavoriteService.addToFavorites(userId, movieId, movieData);

      const isFav = await FavoriteService.isFavorite(userId, movieId);

      expect(isFav).toBe(true);
    });

    it("should return false if movie is not in favorites", async () => {
      userId = await setupTestUser();

      const isFav = await FavoriteService.isFavorite(userId, 999);

      expect(isFav).toBe(false);
    });
  });

  describe("removeFromFavorites", () => {
    it("should remove a movie from favorites", async () => {
      userId = await setupTestUser();
      const movieId = 278;
      const movieData = {
        title: "The Shawshank Redemption",
        posterPath: "/shawshank.jpg",
        releaseDate: "1994-10-14",
        rating: 9.3,
      };

      await FavoriteService.addToFavorites(userId, movieId, movieData);

      const result = await FavoriteService.removeFromFavorites(userId, movieId);

      expect(result).toBe(true);

      const isFav = await FavoriteService.isFavorite(userId, movieId);
      expect(isFav).toBe(false);
    });

    it("should throw error when removing non-existent favorite", async () => {
      userId = await setupTestUser();

      await expect(
        FavoriteService.removeFromFavorites(userId, 999),
      ).rejects.toThrow("Favorite not found");
    });
  });

  describe("getUserFavoriteCount", () => {
    it("should return correct favorite count for user", async () => {
      userId = await setupTestUser();

      const movieData1 = {
        title: "Movie 1",
        posterPath: "/m1.jpg",
        releaseDate: "2020-01-01",
        rating: 8.0,
      };
      const movieData2 = {
        title: "Movie 2",
        posterPath: "/m2.jpg",
        releaseDate: "2021-01-01",
        rating: 8.5,
      };

      await FavoriteService.addToFavorites(userId, 1, movieData1);
      await FavoriteService.addToFavorites(userId, 2, movieData2);

      const count = await FavoriteService.getUserFavoriteCount(userId);

      expect(count).toBe(2);
    });

    it("should return 0 for user with no favorites", async () => {
      userId = await setupTestUser();

      const count = await FavoriteService.getUserFavoriteCount(userId);

      expect(count).toBe(0);
    });
  });
});
