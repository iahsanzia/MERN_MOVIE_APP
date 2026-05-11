import { UserService } from "../../services";
import { describe, it, expect, beforeEach } from "@jest/globals";
import "../setup";

let testCounter = 0;

describe("UserService", () => {
  const timestamp = Date.now();

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const uid = `${timestamp}_${++testCounter}`;
      const result = await UserService.register(
        `user1_${uid}`,
        `user1_${uid}@example.com`,
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
      const uid = `${timestamp}_${++testCounter}`;
      await expect(
        UserService.register(
          "testuser",
          `test_short_${uid}@example.com`,
          "123",
        ),
      ).rejects.toThrow("Password must be at least 6 characters long.");
    });

    it("should throw error if email already exists", async () => {
      const uid = `${timestamp}_${++testCounter}`;
      const email = `duplicate_test_${uid}@example.com`;

      await UserService.register(`user1_${uid}`, email, "Password123");

      await expect(
        UserService.register(`user2b_${uid}`, email, "Password123"),
      ).rejects.toThrow("Email already in use.");
    });

    it("should throw error if username already exists", async () => {
      const uid = `${timestamp}_${++testCounter}`;
      const username = `duplicate_user_${uid}`;

      await UserService.register(
        username,
        `email1_${uid}@example.com`,
        "Password123",
      );

      await expect(
        UserService.register(
          username,
          `email2_${uid}@example.com`,
          "Password123",
        ),
      ).rejects.toThrow("Username already in use.");
    });

    it("should hash password before saving", async () => {
      const uid = `${timestamp}_${++testCounter}`;
      const result = await UserService.register(
        `user_hash_${uid}`,
        `hash_${uid}@example.com`,
        "Password123",
      );

      expect(result.user.password).not.toBe("Password123");
      expect(result.user.password.length).toBeGreaterThan(0);
    });

    it("should generate JWT token", async () => {
      const uid = `${timestamp}_${++testCounter}`;
      const result = await UserService.register(
        `user_jwt_${uid}`,
        `jwt_${uid}@example.com`,
        "Password123",
      );

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.token.split(".").length).toBe(3);
    });

    it("should accept password with exactly 6 characters", async () => {
      const uid = `${timestamp}_${++testCounter}`;
      const result = await UserService.register(
        `user_6char_${uid}`,
        `6char_${uid}@example.com`,
        "123456",
      );

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
    });
  });

  describe("login", () => {
    let timestamp: number;

    beforeEach(async () => {
      timestamp = Date.now();
      const uid = `${timestamp}_${++testCounter}`;
      await UserService.register(
        `login_user_${uid}`,
        `login_${uid}@example.com`,
        "Password123",
      );
      (this as any).uid = uid;
    });

    it("should login user successfully", async () => {
      const uid = (this as any).uid;
      const result = await UserService.login(
        `login_${uid}@example.com`,
        "Password123",
      );

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(`login_${uid}@example.com`);
      expect(result.user.username).toBe(`login_user_${uid}`);
    });

    it("should throw error if email does not exist", async () => {
      const uid = `${Date.now()}_${++testCounter}`;
      await expect(
        UserService.login(`nonexistent_${uid}@example.com`, "Password123"),
      ).rejects.toThrow("Invalid email or password.");
    });

    it("should throw error if password is incorrect", async () => {
      const uid = (this as any).uid;
      await expect(
        UserService.login(`login_${uid}@example.com`, "WrongPassword123"),
      ).rejects.toThrow("Invalid email or password.");
    });

    it("should generate JWT token on login", async () => {
      const uid = (this as any).uid;
      const result = await UserService.login(
        `login_${uid}@example.com`,
        "Password123",
      );

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.token.split(".").length).toBe(3);
    });

    it("should return correct user data on login", async () => {
      const uid = (this as any).uid;
      const result = await UserService.login(
        `login_${uid}@example.com`,
        "Password123",
      );

      expect(result.user._id).toBeDefined();
      expect(result.user.email).toBe(`login_${uid}@example.com`);
      expect(result.user.username).toBe(`login_user_${uid}`);
      expect(result.user.preferences).toBeDefined();
    });
  });

  describe("getUserById", () => {
    let userId: string;

    beforeEach(async () => {
      const uid = `${Date.now()}_${++testCounter}`;
      const result = await UserService.register(
        `user_getbyid_${uid}`,
        `getbyid_${uid}@example.com`,
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
      const uid = `${Date.now()}_${++testCounter}`;
      const result = await UserService.register(
        `user_prefs_${uid}`,
        `prefs_${uid}@example.com`,
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
    let uid: string;

    beforeEach(async () => {
      uid = `${Date.now()}_${++testCounter}`;
      const result = await UserService.register(
        `user_update_${uid}`,
        `update_${uid}@example.com`,
        "Password123",
      );
      userId = result.user._id.toString();
    });

    it("should update username successfully", async () => {
      const updatedUser = await UserService.updateProfile(
        userId,
        `newusername_${uid}`,
      );

      expect(updatedUser?.username).toBe(`newusername_${uid}`);
    });

    it("should update email successfully", async () => {
      const newEmail = `newemail_${uid}@example.com`;
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

      const loginResult = await UserService.login(
        `update_${uid}@example.com`,
        newPassword,
      );
      expect(loginResult).toBeDefined();
    });

    it("should update multiple fields at once", async () => {
      const newEmail = `multi_${uid}@example.com`;
      const updatedUser = await UserService.updateProfile(
        userId,
        `newusername_multi_${uid}`,
        newEmail,
        "NewPassword123",
      );

      expect(updatedUser?.username).toBe(`newusername_multi_${uid}`);
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
      const otherUid = `${Date.now()}_${++testCounter}`;
      const otherEmail = `other_${otherUid}@example.com`;

      await UserService.register(
        `other_user_${otherUid}`,
        otherEmail,
        "Password123",
      );

      await expect(
        UserService.updateProfile(userId, undefined, otherEmail),
      ).rejects.toThrow("Email already in use.");
    });

    it("should throw error if username already in use", async () => {
      const otherUid = `${Date.now()}_${++testCounter}`;
      const otherUsername = `other_user_${otherUid}`;

      await UserService.register(
        otherUsername,
        `other_email_${otherUid}@example.com`,
        "Password123",
      );

      await expect(
        UserService.updateProfile(userId, otherUsername),
      ).rejects.toThrow("Username already in use.");
    });

    it("should allow same email update", async () => {
      const currentEmail = `update_${uid}@example.com`;
      const updatedUser = await UserService.updateProfile(
        userId,
        undefined,
        currentEmail,
      );

      expect(updatedUser?.email).toBe(currentEmail);
    });

    it("should allow same username update", async () => {
      const currentUsername = `user_update_${uid}`;
      const updatedUser = await UserService.updateProfile(
        userId,
        currentUsername,
      );

      expect(updatedUser?.username).toBe(currentUsername);
    });

    it("should not update fields if not provided", async () => {
      const updatedUser = await UserService.updateProfile(userId);

      expect(updatedUser?.username).toBe(`user_update_${uid}`);
      expect(updatedUser?.email).toBe(`update_${uid}@example.com`);
    });
  });

  describe("deleteUser", () => {
    let userId: string;

    beforeEach(async () => {
      const uid = `${Date.now()}_${++testCounter}`;
      const result = await UserService.register(
        `user_delete_${uid}`,
        `delete_${uid}@example.com`,
        "Password123",
      );
      userId = result.user._id.toString();
    });

    it("should delete user successfully", async () => {
      const result = await UserService.deleteUser(userId);

      expect(result).toBe(true);

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
      const uid1 = `${Date.now()}_${++testCounter}`;
      const uid2 = `${Date.now()}_${++testCounter}`;

      await UserService.register(
        `user_all_1_${uid1}`,
        `all_1_${uid1}@example.com`,
        "Password123",
      );
      await UserService.register(
        `user_all_2_${uid2}`,
        `all_2_${uid2}@example.com`,
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
});
