import { UserService } from "../../services";
import { describe, it, expect, beforeEach } from "@jest/globals";
import "../setup";

describe("UserService", () => {
  let userId: string;

  beforeEach(async () => {
    const result = await UserService.register(
      "testuser",
      "test@example.com",
      "Password123",
    );
    userId = result.user._id.toString();
  });

  describe("getUserById", () => {
    it("should get user by ID", async () => {
      const user = await UserService.getUserById(userId);

      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
      expect(user?.username).toBe("testuser");
    });

    it("should return null if user not found", async () => {
      const user = await UserService.getUserById("invalid_id");

      expect(user).toBeNull();
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile", async () => {
      const updatedUser = await UserService.updateProfile(
        userId,
        "newusername",
        "newemail@example.com",
      );

      expect(updatedUser?.username).toBe("newusername");
      expect(updatedUser?.email).toBe("newemail@example.com");
    });

    it("should throw error if email already exists", async () => {
      await UserService.register(
        "anotheruser",
        "another@example.com",
        "Password123",
      );

      await expect(
        UserService.updateProfile(userId, undefined, "another@example.com"),
      ).rejects.toThrow();
    });
  });

  describe("updateUserPreferences", () => {
    it("should update user preferences", async () => {
      const favoriteGenres = ["Action", "Sci-Fi"];
      const languages = ["English", "Spanish"];

      const updatedUser = await UserService.updatePreferences(
        userId,
        favoriteGenres,
        languages,
      );

      expect(updatedUser?.preferences.favoriteGenres).toEqual([
        "Action",
        "Sci-Fi",
      ]);
      expect(updatedUser?.preferences.languages).toEqual([
        "English",
        "Spanish",
      ]);
    });
  });

  describe("deleteUserProfile", () => {
    it("should delete user profile", async () => {
      const result = await UserService.deleteUser(userId);

      expect(result).toBe(true);

      const user = await UserService.getUserById(userId);

      expect(user).toBeNull();
    });
  });
});
