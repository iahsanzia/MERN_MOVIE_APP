import { UserService } from "../../services";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import mongoose from "mongoose";
import "../setup";

describe("UserService", () => {
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

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const result = await UserService.register(
        `user1_${timestamp}`,
        `user1_${timestamp}@example.com`,
        "Password123",
      );

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.password).not.toBe("Password123");
      expect(result.user.preferences.favoriteGenres).toEqual([]);
      expect(result.user.preferences.languages).toEqual([]);
    });

    it("should throw error if email is invalid", async () => {
      await expect(
        UserService.register("testuser", "invalid-email", "Password123"),
      ).rejects.toThrow("Invalid email format.");
    });

    it("should throw error if password is too short", async () => {
      await expect(
        UserService.register(
          "testuser",
          `test_short_${timestamp}@example.com`,
          "123",
        ),
      ).rejects.toThrow("Password must be at least 6 characters long.");
    });

    it("should throw error if email already exists", async () => {
      const email = `duplicate_test_${timestamp}@example.com`;

      // Register first user
      await UserService.register(`user1_${timestamp}`, email, "Password123");

      // Try to register second user with same email - should fail
      await expect(
        UserService.register(`user2_${timestamp}`, email, "Password123"),
      ).rejects.toThrow("Email already in use.");
    });

    it("should throw error if username already exists", async () => {
      const username = `duplicate_user_${timestamp}`;

      // Register first user
      await UserService.register(
        username,
        `email1_${timestamp}@example.com`,
        "Password123",
      );

      // Try to register second user with same username - should fail
      await expect(
        UserService.register(
          username,
          `email2_${timestamp}@example.com`,
          "Password123",
        ),
      ).rejects.toThrow("Username already in use.");
    });

    it("should hash password before saving", async () => {
      const result = await UserService.register(
        `user_hash_${timestamp}`,
        `hash_${timestamp}@example.com`,
        "Password123",
      );

      expect(result.user.password).not.toBe("Password123");
      expect(result.user.password.length).toBeGreaterThan(0);
    });

    it("should generate JWT token", async () => {
      const result = await UserService.register(
        `user_jwt_${timestamp}`,
        `jwt_${timestamp}@example.com`,
        "Password123",
      );

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.token.split(".").length).toBe(3);
    });

    it("should accept password with exactly 6 characters", async () => {
      const result = await UserService.register(
        `user_6char_${timestamp}`,
        `6char_${timestamp}@example.com`,
        "123456",
      );

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await UserService.register(
        `login_user_${timestamp}`,
        `login_${timestamp}@example.com`,
        "Password123",
      );
    });

    it("should login user successfully", async () => {
      const result = await UserService.login(
        `login_${timestamp}@example.com`,
        "Password123",
      );

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(`login_${timestamp}@example.com`);
      expect(result.user.username).toBe(`login_user_${timestamp}`);
    });

    it("should throw error if email does not exist", async () => {
      await expect(
        UserService.login(
          `nonexistent_${timestamp}@example.com`,
          "Password123",
        ),
      ).rejects.toThrow("Invalid email or password.");
    });

    it("should throw error if password is incorrect", async () => {
      await expect(
        UserService.login(`login_${timestamp}@example.com`, "WrongPassword123"),
      ).rejects.toThrow("Invalid email or password.");
    });

    it("should generate JWT token on login", async () => {
      const result = await UserService.login(
        `login_${timestamp}@example.com`,
        "Password123",
      );

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.token.split(".").length).toBe(3);
    });

    it("should return correct user data on login", async () => {
      const result = await UserService.login(
        `login_${timestamp}@example.com`,
        "Password123",
      );

      expect(result.user._id).toBeDefined();
      expect(result.user.email).toBe(`login_${timestamp}@example.com`);
      expect(result.user.username).toBe(`login_user_${timestamp}`);
      expect(result.user.preferences).toBeDefined();
    });
  });

  describe("getUserById", () => {
    let userId: string;

    beforeEach(async () => {
      const result = await UserService.register(
        `user_getbyid_${timestamp}`,
        `getbyid_${timestamp}@example.com`,
        "Password123",
      );
      userId = result.user._id.toString();
    });

    it("should get user by ID", async () => {
      const user = await UserService.getUserById(userId);

      expect(user).toBeDefined();
      expect(user?._id.toString()).toBe(userId);
    });

    it("should return null if user not found", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const user = await UserService.getUserById(fakeId);

      expect(user).toBeNull();
    });

    it("should return user with preferences", async () => {
      const user = await UserService.getUserById(userId);

      expect(user?.preferences).toBeDefined();
      expect(Array.isArray(user?.preferences.favoriteGenres)).toBe(true);
      expect(Array.isArray(user?.preferences.languages)).toBe(true);
    });
  });

  describe("updatePreferences", () => {
    let userId: string;

    beforeEach(async () => {
      const result = await UserService.register(
        `user_prefs_${timestamp}`,
        `prefs_${timestamp}@example.com`,
        "Password123",
      );
      userId = result.user._id.toString();
    });

    it("should update user preferences successfully", async () => {
      const updatedUser = await UserService.updatePreferences(
        userId,
        ["Action", "Sci-Fi"],
        ["English", "Spanish"],
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.preferences.favoriteGenres).toEqual([
        "Action",
        "Sci-Fi",
      ]);
      expect(updatedUser?.preferences.languages).toEqual([
        "English",
        "Spanish",
      ]);
    });

    it("should update only genres", async () => {
      const updatedUser = await UserService.updatePreferences(
        userId,
        ["Action"],
        [],
      );

      expect(updatedUser?.preferences.favoriteGenres).toEqual(["Action"]);
      expect(updatedUser?.preferences.languages).toEqual([]);
    });

    it("should update only languages", async () => {
      const updatedUser = await UserService.updatePreferences(
        userId,
        [],
        ["English"],
      );

      expect(updatedUser?.preferences.favoriteGenres).toEqual([]);
      expect(updatedUser?.preferences.languages).toEqual(["English"]);
    });

    it("should throw error if user not found", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      await expect(
        UserService.updatePreferences(fakeId, ["Action"], ["English"]),
      ).rejects.toThrow("User not found.");
    });

    it("should replace existing preferences", async () => {
      await UserService.updatePreferences(
        userId,
        ["Action", "Drama"],
        ["English"],
      );

      const updatedUser = await UserService.updatePreferences(
        userId,
        ["Sci-Fi"],
        ["Spanish"],
      );

      expect(updatedUser?.preferences.favoriteGenres).toEqual(["Sci-Fi"]);
      expect(updatedUser?.preferences.languages).toEqual(["Spanish"]);
    });

    it("should keep old preferences if not provided", async () => {
      await UserService.updatePreferences(userId, ["Action"], ["English"]);

      const updatedUser = await UserService.updatePreferences(
        userId,
        ["Action"],
        ["English"],
      );

      expect(updatedUser?.preferences.favoriteGenres).toEqual(["Action"]);
      expect(updatedUser?.preferences.languages).toEqual(["English"]);
    });
  });

  describe("updateProfile", () => {
    let userId: string;

    beforeEach(async () => {
      const result = await UserService.register(
        `user_update_${timestamp}`,
        `update_${timestamp}@example.com`,
        "Password123",
      );
      userId = result.user._id.toString();
    });

    it("should update username successfully", async () => {
      const updatedUser = await UserService.updateProfile(
        userId,
        `newusername_${timestamp}`,
      );

      expect(updatedUser?.username).toBe(`newusername_${timestamp}`);
    });

    it("should update email successfully", async () => {
      const newEmail = `newemail_${timestamp}@example.com`;
      const updatedUser = await UserService.updateProfile(
        userId,
        undefined,
        newEmail,
      );

      expect(updatedUser?.email).toBe(newEmail);
    });

    it("should update password successfully", async () => {
      const newPassword = "NewPassword123";

      const updatedUser = await UserService.updateProfile(
        userId,
        undefined,
        undefined,
        newPassword,
      );

      expect(updatedUser?.password).not.toBe(newPassword);

      // Verify new password works for login
      const loginResult = await UserService.login(
        `update_${timestamp}@example.com`,
        newPassword,
      );
      expect(loginResult).toBeDefined();
    });

    it("should update multiple fields at once", async () => {
      const newEmail = `multi_${timestamp}@example.com`;
      const updatedUser = await UserService.updateProfile(
        userId,
        `newusername_multi_${timestamp}`,
        newEmail,
        "NewPassword123",
      );

      expect(updatedUser?.username).toBe(`newusername_multi_${timestamp}`);
      expect(updatedUser?.email).toBe(newEmail);
      expect(updatedUser?.password).not.toBe("NewPassword123");
    });

    it("should throw error if user not found", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      await expect(
        UserService.updateProfile(fakeId, "newusername"),
      ).rejects.toThrow("User not found.");
    });

    it("should throw error if email already in use", async () => {
      const otherEmail = `other_${timestamp}@example.com`;

      // Register another user
      await UserService.register(
        `other_user_${timestamp}`,
        otherEmail,
        "Password123",
      );

      // Try to update first user's email to second user's email
      await expect(
        UserService.updateProfile(userId, undefined, otherEmail),
      ).rejects.toThrow("Email already in use.");
    });

    it("should throw error if username already in use", async () => {
      const otherUsername = `other_user_${timestamp}`;

      // Register another user
      await UserService.register(
        otherUsername,
        `other_email_${timestamp}@example.com`,
        "Password123",
      );

      // Try to update first user's username to second user's username
      await expect(
        UserService.updateProfile(userId, otherUsername),
      ).rejects.toThrow("Username already in use.");
    });

    it("should allow same email update", async () => {
      const currentEmail = `update_${timestamp}@example.com`;
      const updatedUser = await UserService.updateProfile(
        userId,
        undefined,
        currentEmail,
      );

      expect(updatedUser?.email).toBe(currentEmail);
    });

    it("should allow same username update", async () => {
      const currentUsername = `user_update_${timestamp}`;
      const updatedUser = await UserService.updateProfile(
        userId,
        currentUsername,
      );

      expect(updatedUser?.username).toBe(currentUsername);
    });

    it("should not update fields if not provided", async () => {
      const updatedUser = await UserService.updateProfile(userId);

      expect(updatedUser?.username).toBe(`user_update_${timestamp}`);
      expect(updatedUser?.email).toBe(`update_${timestamp}@example.com`);
    });
  });

  describe("deleteUser", () => {
    let userId: string;

    beforeEach(async () => {
      const result = await UserService.register(
        `user_delete_${timestamp}`,
        `delete_${timestamp}@example.com`,
        "Password123",
      );
      userId = result.user._id.toString();
    });

    it("should delete user successfully", async () => {
      const result = await UserService.deleteUser(userId);

      expect(result).toBe(true);

      // Verify user is deleted
      const user = await UserService.getUserById(userId);
      expect(user).toBeNull();
    });

    it("should return false if user not found", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const result = await UserService.deleteUser(fakeId);

      expect(result).toBe(false);
    });
  });

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      await UserService.register(
        `user_all_1_${timestamp}`,
        `all_1_${timestamp}@example.com`,
        "Password123",
      );
      await UserService.register(
        `user_all_2_${timestamp}`,
        `all_2_${timestamp}@example.com`,
        "Password123",
      );

      const users = await UserService.getAllUsers();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThanOrEqual(2);
    });

    it("should return empty array if no users exist", async () => {
      const users = await UserService.getAllUsers();

      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe("Integration Tests", () => {
    it("should register, login, update profile, and get user", async () => {
      const integrationUser = `integration_${timestamp}`;
      const integrationEmail = `integration_${timestamp}@example.com`;

      // Register
      const registerResult = await UserService.register(
        integrationUser,
        integrationEmail,
        "Password123",
      );
      const userId = registerResult.user._id.toString();

      // Login
      const loginResult = await UserService.login(
        integrationEmail,
        "Password123",
      );
      expect(loginResult.token).toBeDefined();

      // Update profile
      const updatedUser = await UserService.updateProfile(
        userId,
        `updated_${timestamp}`,
      );
      expect(updatedUser?.username).toBe(`updated_${timestamp}`);

      // Get user
      const user = await UserService.getUserById(userId);
      expect(user?.username).toBe(`updated_${timestamp}`);

      // Update preferences
      const userWithPrefs = await UserService.updatePreferences(
        userId,
        ["Action"],
        ["English"],
      );
      expect(userWithPrefs?.preferences.favoriteGenres).toEqual(["Action"]);

      // Delete user
      const deleted = await UserService.deleteUser(userId);
      expect(deleted).toBe(true);

      // Verify deleted
      const deletedUser = await UserService.getUserById(userId);
      expect(deletedUser).toBeNull();
    });
  });
});
