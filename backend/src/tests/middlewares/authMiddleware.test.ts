import { auth } from "../../middlewares/authMiddleware";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock AuthService before importing
jest.mock("../../services/AuthService", () => ({
  __esModule: true,
  default: {
    verifyToken: jest.fn(),
  },
}));

import { AuthService } from "../../services";
import { AppError } from "../../utils";

describe("authMiddleware", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock response methods
    mockJsonFn = jest.fn().mockReturnValue(undefined);
    mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });

    // Setup mock request
    mockReq = {
      headers: {},
      userId: undefined,
      email: undefined,
    };

    // Setup mock response
    mockRes = {
      status: mockStatusFn,
      json: mockJsonFn,
    };

    // Setup mock next function
    mockNext = jest.fn();
  });

  describe("valid token", () => {
    it("should call next() and attach userId and email to request", () => {
      const tokenData = { userId: "user123", email: "test@example.com" };
      const token = "valid_token";

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      (AuthService.verifyToken as jest.Mock).mockReturnValue(tokenData);

      auth(mockReq, mockRes, mockNext);

      expect(AuthService.verifyToken).toHaveBeenCalledWith(token);
      expect(mockReq.userId).toBe("user123");
      expect(mockReq.email).toBe("test@example.com");
      expect(mockNext).toHaveBeenCalled();
      expect(mockStatusFn).not.toHaveBeenCalled();
    });

    it("should extract token correctly from Bearer format", () => {
      const tokenData = { userId: "user456", email: "user@example.com" };
      const token = "bearer_token_string";

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      (AuthService.verifyToken as jest.Mock).mockReturnValue(tokenData);

      auth(mockReq, mockRes, mockNext);

      expect(AuthService.verifyToken).toHaveBeenCalledWith(token);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should preserve token payload structure", () => {
      const tokenData = {
        userId: "complex_user_id_123",
        email: "complex+tag@example.com",
      };
      const token = "complex_token";

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      (AuthService.verifyToken as jest.Mock).mockReturnValue(tokenData);

      auth(mockReq, mockRes, mockNext);

      expect(mockReq.userId).toBe(tokenData.userId);
      expect(mockReq.email).toBe(tokenData.email);
    });
  });

  describe("missing token", () => {
    it("should return 401 when Authorization header is missing", () => {
      mockReq.headers = {};

      auth(mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        message: "No Token provided. Authorization required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when Authorization header is empty", () => {
      mockReq.headers = {
        authorization: "",
      };

      auth(mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        message: "No Token provided. Authorization required",
      });
    });

    it("should return 401 when Authorization header has no token part", () => {
      mockReq.headers = {
        authorization: "Bearer",
      };

      auth(mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        message: "No Token provided. Authorization required",
      });
    });
  });

  describe("invalid token", () => {
    it("should return 401 when verifyToken returns null", () => {
      const token = "invalid_token";

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      (AuthService.verifyToken as jest.Mock).mockReturnValue(null);

      auth(mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        message: "Invalid or expired Token",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when token is expired (verifyToken returns null)", () => {
      const expiredToken = "expired_token";

      mockReq.headers = {
        authorization: `Bearer ${expiredToken}`,
      };

      (AuthService.verifyToken as jest.Mock).mockReturnValue(null);

      auth(mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        message: "Invalid or expired Token",
      });
    });
  });

  describe("error handling", () => {
    it("should catch and respond with 500 for non-AppError exceptions", () => {
      const token = "problematic_token";

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      (AuthService.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      auth(mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        message: "Authentication Error",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle AppError exceptions with proper status code", () => {
      const token = "app_error_token";
      const appError = new AppError("Custom auth error", 401);

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      (AuthService.verifyToken as jest.Mock).mockImplementation(() => {
        throw appError;
      });

      auth(mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        message: "Custom auth error",
      });
    });
  });

  describe("response format", () => {
    it("should always return JSON with status and message fields", () => {
      mockReq.headers = {};

      auth(mockReq, mockRes, mockNext);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs).toBeDefined();
      expect(callArgs).toHaveProperty("status");
      expect(callArgs).toHaveProperty("message");
      expect(callArgs.status).toBe("error");
      expect(typeof callArgs.message).toBe("string");
    });
  });
});
