import { errorHandler } from "../../middlewares/errorHandler";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("errorHandler", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    mockJsonFn = jest.fn().mockReturnValue(undefined);
    mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });

    mockReq = {};
    mockRes = {
      status: mockStatusFn,
      json: mockJsonFn,
    };
    mockNext = jest.fn();
  });

  describe("error with statusCode", () => {
    it("should return error with provided statusCode", () => {
      const error = new Error("Validation error");
      (error as any).statusCode = 400;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        statusCode: 400,
        message: "Validation error",
      });
    });

    it("should handle 401 unauthorized error", () => {
      const error = new Error("Unauthorized access");
      (error as any).statusCode = 401;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        statusCode: 401,
        message: "Unauthorized access",
      });
    });

    it("should handle 403 forbidden error", () => {
      const error = new Error("Forbidden");
      (error as any).statusCode = 403;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(403);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        statusCode: 403,
        message: "Forbidden",
      });
    });

    it("should handle 404 not found error", () => {
      const error = new Error("Resource not found");
      (error as any).statusCode = 404;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        statusCode: 404,
        message: "Resource not found",
      });
    });
  });

  describe("error without statusCode", () => {
    it("should default to 500 when statusCode is not provided", () => {
      const error = new Error("Unknown error");

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        statusCode: 500,
        message: "Unknown error",
      });
    });

    it("should use Internal Server Error message when error message is empty", () => {
      const error: any = {
        statusCode: undefined,
        message: undefined,
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        status: "error",
        statusCode: 500,
        message: "Internal Server Error",
      });
    });
  });

  describe("response format", () => {
    it("should always return JSON with status, statusCode, and message", () => {
      const error = new Error("Test error");
      (error as any).statusCode = 400;

      errorHandler(error, mockReq, mockRes, mockNext);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs).toHaveProperty("status");
      expect(callArgs).toHaveProperty("statusCode");
      expect(callArgs).toHaveProperty("message");
      expect(callArgs.status).toBe("error");
      expect(typeof callArgs.statusCode).toBe("number");
      expect(typeof callArgs.message).toBe("string");
    });

    it("should not call next() function", () => {
      const error = new Error("Test error");
      (error as any).statusCode = 500;

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
