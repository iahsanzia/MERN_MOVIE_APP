import { WatchedRepository } from "../../repositories";
import { UserService } from "../../services";
import { describe, it, expect, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import "../setup";

let testCounter = 0;

describe("WatchedRepository", () => {
  const timestamp = Date.now();
  let testUserId: string;

  beforeEach(async () => {
    const uid = `${timestamp}_${++testCounter}`;
    const result = await UserService.register(
      `watched_user_${uid}`,
      `watched_${uid}@example.com`,
      "Password123",
    );
    testUserId = result.user._id.toString();
  });

  describe("create", () => {
    it("should create a watched movie successfully", async () => {
      const watchedData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 650,
        title: "Watched Movie",
        genres: ["Drama"],
        cast: [],
        summary: "Test",
        rating: 7.0,
        releaseDate: new Date(),
        posterPath: "/watched.jpg",
        WatchedAt: new Date(),
      };

      const watched = await WatchedRepository.create(watchedData);

      expect(watched).toBeDefined();
      expect(watched.movieId).toBe(650);
      expect(watched.title).toBe("Watched Movie");
    });
  });

  describe("findByUserId", () => {
    it("should find all watched movies for a user", async () => {
      const watchedData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 651,
        title: "Watched 1",
        genres: ["Action"],
        cast: [],
        summary: "Test",
        rating: 7.0,
        releaseDate: new Date(),
        posterPath: "/watched1.jpg",
        WatchedAt: new Date(),
      };
      await WatchedRepository.create(watchedData);

      const watched = await WatchedRepository.findByUserId(testUserId);

      expect(Array.isArray(watched)).toBe(true);
      expect(watched.length).toBeGreaterThan(0);
      expect(watched[0]?.userId.toString()).toBe(testUserId);
    });

    it("should return empty array when user has no watched movies", async () => {
      const uid = `${timestamp}_noway_${++testCounter}`;
      const result = await UserService.register(
        `noway_${uid}`,
        `noway_${uid}@example.com`,
        "Password123",
      );
      const newUserId = result.user._id.toString();

      const watched = await WatchedRepository.findByUserId(newUserId);

      expect(Array.isArray(watched)).toBe(true);
      expect(watched.length).toBe(0);
    });
  });

  //   describe("findByUserIdAndMovieId", () => {
  //     it("should find specific watched movie by userId and movieId", async () => {
  //       const movieId = 652;
  //       const watchedData = {
  //         userId: new mongoose.Types.ObjectId(testUserId),
  //         movieId,
  //         title: "Specific Watched",
  //         genres: ["Thriller"],
  //         cast: [],
  //         summary: "Test",
  //         rating: 7.0,
  //         releaseDate: new Date(),
  //         posterPath: "/specific_watched.jpg",
  //         WatchedAt: new Date(),
  //       };
  //       await WatchedRepository.create(watchedData);

  //       const watched = await WatchedRepository.findByUserIdAndMovieId(
  //         testUserId,
  //         movieId,
  //       );

  //       expect(watched).toBeDefined();
  //       expect(watched?.movieId).toBe(movieId);
  //     });

  //     it("should return null when watched movie not found", async () => {
  //       const watched = await WatchedRepository.findByUserIdAndMovieId(
  //         testUserId,
  //         999999,
  //       );

  //       expect(watched).toBeNull();
  //     });
  //   });

  describe("findAll", () => {
    it("should return all watched movies", async () => {
      const watched = await WatchedRepository.findAll();

      expect(Array.isArray(watched)).toBe(true);
    });
  });

  describe("deleteByUserIdAndMovieId", () => {
    it("should delete watched movie by userId and movieId", async () => {
      const movieId = 653;
      const watchedData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId,
        title: "Delete Watched",
        genres: ["Comedy"],
        cast: [],
        summary: "Test",
        rating: 7.0,
        releaseDate: new Date(),
        posterPath: "/delete_watched.jpg",
        WatchedAt: new Date(),
      };
      await WatchedRepository.create(watchedData);

      const deleted = await WatchedRepository.deleteByUserIdAndMovieId(
        testUserId,
        movieId,
      );

      expect(deleted).toBe(true);
      const found = await WatchedRepository.findByUserIdAndMovieId(
        testUserId,
        movieId,
      );
      expect(found).toBeNull();
    });

    it("should return false when watched movie not found", async () => {
      const deleted = await WatchedRepository.deleteByUserIdAndMovieId(
        testUserId,
        999999,
      );

      expect(deleted).toBe(false);
    });
  });

  describe("findById", () => {
    it("should find watched movie by ID", async () => {
      const watchedData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 654,
        title: "Find By ID",
        genres: ["Action"],
        cast: [],
        summary: "Test",
        rating: 7.0,
        releaseDate: new Date(),
        posterPath: "/id_watched.jpg",
        WatchedAt: new Date(),
      };
      const created = await WatchedRepository.create(watchedData);

      const found = await WatchedRepository.findById(created._id.toString());

      expect(found).toBeDefined();
      expect(found?.movieId).toBe(654);
    });

    it("should return null for invalid ID", async () => {
      const found = await WatchedRepository.findById(
        "507f1f77bcf86cd799439011",
      );

      expect(found).toBeNull();
    });
  });

  describe("update", () => {
    it("should update watched movie successfully", async () => {
      const watchedData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 655,
        title: "Original Watched",
        genres: ["Drama"],
        cast: [],
        summary: "Test",
        rating: 7.0,
        releaseDate: new Date(),
        posterPath: "/original_watched.jpg",
        WatchedAt: new Date(),
      };
      const created = await WatchedRepository.create(watchedData);

      const updated = await WatchedRepository.update(created._id.toString(), {
        rating: 9.0,
      });

      expect(updated).toBeDefined();
      expect(updated?.rating).toBe(9.0);
    });
  });

  describe("deleteById", () => {
    it("should delete watched movie by ID", async () => {
      const watchedData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId: 656,
        title: "Delete By ID Watched",
        genres: ["Thriller"],
        cast: [],
        summary: "Test",
        rating: 7.0,
        releaseDate: new Date(),
        posterPath: "/delid_watched.jpg",
        WatchedAt: new Date(),
      };
      const created = await WatchedRepository.create(watchedData);

      const deleted = await WatchedRepository.deleteById(
        created._id.toString(),
      );

      expect(deleted).toBe(true);
      const found = await WatchedRepository.findById(created._id.toString());
      expect(found).toBeNull();
    });
  });

  describe("findByMovieId", () => {
    it("should find all watched entries for a movie", async () => {
      const movieId = 657;
      const watchedData = {
        userId: new mongoose.Types.ObjectId(testUserId),
        movieId,
        title: "Movie Watched",
        genres: ["Action"],
        cast: [],
        summary: "Test",
        rating: 7.0,
        releaseDate: new Date(),
        posterPath: "/movie_watched.jpg",
        WatchedAt: new Date(),
      };
      await WatchedRepository.create(watchedData);

      const watched = await WatchedRepository.findByMovieId(movieId);

      expect(Array.isArray(watched)).toBe(true);
      expect(watched.length).toBeGreaterThan(0);
      expect(watched[0]?.movieId).toBe(movieId);
    });
  });
});
