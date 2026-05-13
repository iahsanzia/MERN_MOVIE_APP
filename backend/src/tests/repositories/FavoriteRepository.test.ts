import { FavoriteRepository } from "../../repositories";
import { UserService } from "../../services";
import { describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import "../setup";

let testCounter = 0;

describe("FavoriteRepository", () => {
  const timestamp = Date.now();
  let testUserId: string;

  beforeEach(async () => {
    const uid = `${timestamp}_${++testCounter}`;
    const result = await UserService.register(
      `fav_user_${uid}`,
      `fav_${uid}@example.com`,
      "Password123",
    );
    testUserId = result.user._id.toString();
  });

  describe("create", () => {
    it("should create a favorite successfully", async () => {
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 550,
        title: "Fight Club",
        posterPath: "/poster.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };

      const favorite = await FavoriteRepository.create(favoriteData);

      expect(favorite).toBeDefined();
      expect(favorite.movieId).toBe(550);
      expect(favorite.title).toBe("Fight Club");
    });
  });

  describe("findByUserId", () => {
    it("should find all favorites for a user", async () => {
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 551,
        title: "Movie 1",
        posterPath: "/movie1.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };
      await FavoriteRepository.create(favoriteData);

      const favorites = await FavoriteRepository.findByUserId(testUserId);

      expect(Array.isArray(favorites)).toBe(true);
      expect(favorites.length).toBeGreaterThan(0);
      expect(favorites[0]?.userId.toString()).toBe(testUserId);
    });

    it("should return empty array when user has no favorites", async () => {
      const uid = `${timestamp}_nofav_${++testCounter}`;
      const result = await UserService.register(
        `nofav_${uid}`,
        `nofav_${uid}@example.com`,
        "Password123",
      );
      const newUserId = result.user._id.toString();

      const favorites = await FavoriteRepository.findByUserId(newUserId);

      expect(Array.isArray(favorites)).toBe(true);
      expect(favorites.length).toBe(0);
    });
  });

  describe("findByUserIdAndMovieId", () => {
    it("should find specific favorite by userId and movieId", async () => {
      const movieId = 552;
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId,
        title: "Specific Movie",
        posterPath: "/specific.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };
      await FavoriteRepository.create(favoriteData);

      const favorite = await FavoriteRepository.findByUserIdAndMovieId(
        testUserId,
        movieId,
      );

      expect(favorite).toBeDefined();
      expect(favorite?.movieId).toBe(movieId);
    });

    it("should return null when favorite not found", async () => {
      const favorite = await FavoriteRepository.findByUserIdAndMovieId(
        testUserId,
        999999,
      );

      expect(favorite).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all favorites", async () => {
      const favorites = await FavoriteRepository.findAll();

      expect(Array.isArray(favorites)).toBe(true);
    });
  });

  describe("deleteByUserIdAndMovieId", () => {
    it("should delete favorite by userId and movieId", async () => {
      const movieId = 553;
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId,
        title: "Delete Me",
        posterPath: "/delete.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };
      await FavoriteRepository.create(favoriteData);

      const deleted = await FavoriteRepository.deleteByUserIdAndMovieId(
        testUserId,
        movieId,
      );

      expect(deleted).toBe(true);
      const found = await FavoriteRepository.findByUserIdAndMovieId(
        testUserId,
        movieId,
      );
      expect(found).toBeNull();
    });

    it("should return false when favorite not found", async () => {
      const deleted = await FavoriteRepository.deleteByUserIdAndMovieId(
        testUserId,
        999999,
      );

      expect(deleted).toBe(false);
    });
  });

  describe("findById", () => {
    it("should find favorite by ID", async () => {
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 554,
        title: "Find By ID",
        posterPath: "/id.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };
      const created = await FavoriteRepository.create(favoriteData);

      const found = await FavoriteRepository.findById(created._id.toString());

      expect(found).toBeDefined();
      expect(found?.movieId).toBe(554);
    });

    it("should return null for invalid ID", async () => {
      const found = await FavoriteRepository.findById(
        "507f1f77bcf86cd799439011",
      );

      expect(found).toBeNull();
    });
  });

  describe("update", () => {
    it("should update favorite successfully", async () => {
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 555,
        title: "Original",
        posterPath: "/original.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };
      const created = await FavoriteRepository.create(favoriteData);

      const updated = await FavoriteRepository.update(created._id.toString(), {
        title: "Updated Title",
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe("Updated Title");
    });
  });

  describe("deleteById", () => {
    it("should delete favorite by ID", async () => {
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 556,
        title: "Delete By ID",
        posterPath: "/delid.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };
      const created = await FavoriteRepository.create(favoriteData);

      const deleted = await FavoriteRepository.deleteById(
        created._id.toString(),
      );

      expect(deleted).toBe(true);
      const found = await FavoriteRepository.findById(created._id.toString());
      expect(found).toBeNull();
    });
  });

  describe("findByMovieId", () => {
    it("should find all favorites for a movie", async () => {
      const movieId = 557;
      const favoriteData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId,
        title: "Movie Favorite",
        posterPath: "/movie.jpg",
        releaseDate: "2020-01-01",
        addedAt: new Date(),
      };
      await FavoriteRepository.create(favoriteData);

      const favorites = await FavoriteRepository.findByMovieId(movieId);

      expect(Array.isArray(favorites)).toBe(true);
      expect(favorites.length).toBeGreaterThan(0);
      expect(favorites[0]?.movieId).toBe(movieId);
    });
  });
});
