import { UserRepository } from "../../repositories";
import { UserService } from "../../services";
import { describe, it, expect, beforeEach } from "@jest/globals";
import "../setup";

let testCounter = 0;

describe("UserRepository", () => {
  const timestamp = Date.now();
  let testUserId: string;

  beforeEach(async () => {
    const uid = `${timestamp}_${++testCounter}`;
    const result = await UserService.register(
      `repo_user_${uid}`,
      `repo_user_${uid}@example.com`,
      "Password123",
    );
    testUserId = result.user._id.toString();
  });

  describe("create", () => {
    it("should create a new user successfully", async () => {
      const uid = `${timestamp}_create_${++testCounter}`;
      const userData = {
        username: `new_user_${uid}`,
        email: `new_${uid}@example.com`,
        password: "HashedPassword",
        preferences: { favoriteGenres: [], languages: [] },
      };

      const user = await UserRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const uid = `${timestamp}_email_${++testCounter}`;
      const email = `find_by_email_${uid}@example.com`;
      await UserService.register(`user_${uid}`, email, "Password123");

      const user = await UserRepository.findByEmail(email);

      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
    });

    it("should return null when email not found", async () => {
      const user = await UserRepository.findByEmail("nonexistent@example.com");

      expect(user).toBeNull();
    });
  });

  //   describe("findById", () => {
  //     it("should find user by valid ID", async () => {
  //       const user = await UserRepository.findById(testUserId);

  //       expect(user).toBeDefined();
  //       expect(user?._id.toString()).toBe(testUserId);
  //     });

  //     it("should return null for invalid ObjectId", async () => {
  //       const user = await UserRepository.findById("invalid_id");

  //       expect(user).toBeNull();
  //     });

  //     it("should return null when user not found", async () => {
  //       const user = await UserRepository.findById("507f1f77bcf86cd799439011");

  //       expect(user).toBeNull();
  //     });
  //   });

  describe("findAll", () => {
    it("should return all users", async () => {
      const users = await UserRepository.findAll();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe("findByUsername", () => {
    it("should find user by username", async () => {
      const uid = `${timestamp}_username_${++testCounter}`;
      const username = `username_${uid}`;
      await UserService.register(
        username,
        `user_${uid}@example.com`,
        "Password123",
      );

      const user = await UserRepository.findByUsername(username);

      expect(user).toBeDefined();
      expect(user?.username).toBe(username);
    });

    it("should return null when username not found", async () => {
      const user = await UserRepository.findByUsername(
        "nonexistent_user_12345",
      );

      expect(user).toBeNull();
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const updateData = {
        preferences: {
          favoriteGenres: ["Action"],
          languages: ["en"],
        },
      };

      const updatedUser = await UserRepository.update(testUserId, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.preferences.favoriteGenres).toEqual(["Action"]);
    });

    it("should return null for invalid ObjectId", async () => {
      const result = await UserRepository.update("invalid_id", {});

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      const uid = `${timestamp}_delete_${++testCounter}`;
      const result = await UserService.register(
        `delete_user_${uid}`,
        `delete_${uid}@example.com`,
        "Password123",
      );
      const userIdToDelete = result.user._id.toString();

      const deleted = await UserRepository.delete(userIdToDelete);

      expect(deleted).toBe(true);
      const foundUser = await UserRepository.findById(userIdToDelete);
      expect(foundUser).toBeNull();
    });

    it("should return false for invalid ObjectId", async () => {
      const result = await UserRepository.delete("invalid_id");

      expect(result).toBe(false);
    });

    it("should return false when user not found", async () => {
      const result = await UserRepository.delete("507f1f77bcf86cd799439011");

      expect(result).toBe(false);
    });
  });
});
