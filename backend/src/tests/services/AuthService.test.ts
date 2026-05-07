import { AuthService } from "../../services";
import { describe, it, expect } from "@jest/globals";
import "../setup";

describe("AuthService", () => {
  describe("hashPassword", () => {
    it("should hash password successfully", async () => {
      const password = "Password123";

      const hashedPassword = await AuthService.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });
    it("should produce different hashes for the same password", async () => {
      const password = "Password123";
      const hash1 = await AuthService.hashPassword(password);
      const hash2 = await AuthService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for correct password", async () => {
      const password = "Password123";
      const hashedPassword = await AuthService.hashPassword(password);

      const isMatch = await AuthService.comparePassword(
        password,
        hashedPassword,
      );

      expect(isMatch).toBe(true);
    });
    it("should return false for incorrect password", async () => {
      const password = "Password123";
      const hashedPassword = await AuthService.hashPassword(password);

      const isMatch = await AuthService.comparePassword(
        "WrongPassword",
        hashedPassword,
      );

      expect(isMatch).toBe(false);
    });
  });
  describe("generateToken", () => {
    it("should generate a valid JWT token", async () => {
      const userId = "user123";
      const email = "test@example.com";

      const token = await AuthService.generateToken(userId, email);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    });
    it("should generate different tokens for different users", async () => {
      const token1 = AuthService.generateToken("user1", "user1@example.com");
      const token2 = AuthService.generateToken("user2", "user2@example.com");

      expect(token1).not.toBe(token2);
    });
  });
  describe("verifyToken", () => {
    it("should verify valid token", () => {
      const userId = "user123";
      const email = "test@example.com";

      const token = AuthService.generateToken(userId, email);
      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
      expect(decoded?.email).toBe(email);
    });
    it("should return null for invalid token", () => {
      const decoded = AuthService.verifyToken("invalid_token");
      expect(decoded).toBeNull();
    });

    it("should return null for expired token", async () => {
      const payload = { userId: "user123", email: "test@example.com" };
      const token = require("jsonwebtoken").sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "0s" },
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeNull();
    });
    it("should return null for tampered token", () => {
      const token = AuthService.generateToken("user123", "test@example.com");
      const tamperedToken = token.slice(0, -5) + "XXXXX"; // Change last 5 chars

      const decoded = AuthService.verifyToken(tamperedToken);

      expect(decoded).toBeNull();
    });
  });
  describe("validateEmaiil", () => {
    it("should validate correct email", () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.co.uk",
        "user+tag@example.com",
        "user123@test-domain.com",
      ];

      validEmails.forEach((email) => {
        expect(AuthService.validateEmaiil(email)).toBe(true);
      });
    });

    it("should reject invalid emails", () => {
      const invalidEmails = [
        "invalid.email",
        "user@",
        "@example.com",
        "user@.com",
        "user space@example.com",
      ];

      invalidEmails.forEach((email) => {
        expect(AuthService.validateEmaiil(email)).toBe(false);
      });
    });
  });

  describe("validatePassword", () => {
    it("should validate strong password", () => {
      const result = AuthService.validatePassword("Password123");

      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it("should reject password shorter than 6 characters", () => {
      const result = AuthService.validatePassword("pass");

      expect(result.valid).toBe(false);
      //   expect(result.message).toBe(
      //     "Password must be at least 6 characters long.",
      //   );
    });

    it("should reject empty password", () => {
      const result = AuthService.validatePassword("");

      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        "Password must be at least 6 characters long.",
      );
    });

    it("should accept password with exactly 6 characters", () => {
      const result = AuthService.validatePassword("123456");

      expect(result.valid).toBe(true);
    });

    it("should accept long password", () => {
      const result = AuthService.validatePassword(
        "VeryLongPasswordWith123SpecialChars!@#",
      );

      expect(result.valid).toBe(true);
    });
  });
});
