import { notFoundHandler } from "../../middlewares/notFoundHandler";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("notFoundHandler", () => {
  let mockReq: any;
  let mockRes: any;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    mockJsonFn = jest.fn().mockReturnValue(undefined);
    mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });

    mockReq = {
      originalUrl: "/api/unknown",
    };
    mockRes = {
      status: mockStatusFn,
      json: mockJsonFn,
    };
  });

  describe("404 response", () => {
    it("should return 404 status code", () => {
      notFoundHandler(mockReq, mockRes);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
    });

    it("should return error status in JSON response", () => {
      notFoundHandler(mockReq, mockRes);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs.status).toBe("error");
    });

    it("should include route path in error message", () => {
      notFoundHandler(mockReq, mockRes);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs.message).toContain("/api/unknown");
      expect(callArgs.message).toContain("not found");
    });
  });

  describe("different routes", () => {
    it("should handle /users endpoint not found", () => {
      mockReq.originalUrl = "/api/users/invalid";

      notFoundHandler(mockReq, mockRes);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs.message).toContain("/api/users/invalid");
    });

    it("should handle /movies endpoint not found", () => {
      mockReq.originalUrl = "/api/movies/invalid";

      notFoundHandler(mockReq, mockRes);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs.message).toContain("/api/movies/invalid");
    });

    it("should handle root path not found", () => {
      mockReq.originalUrl = "/invalid";

      notFoundHandler(mockReq, mockRes);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs.message).toContain("/invalid");
    });
  });

  describe("response format", () => {
    it("should return JSON with status and message fields", () => {
      notFoundHandler(mockReq, mockRes);

      const callArgs = mockJsonFn.mock.calls[0]?.[0] as any;
      expect(callArgs).toHaveProperty("status");
      expect(callArgs).toHaveProperty("message");
      expect(callArgs.status).toBe("error");
      expect(typeof callArgs.message).toBe("string");
    });

    it("should always call json() method", () => {
      notFoundHandler(mockReq, mockRes);

      expect(mockJsonFn).toHaveBeenCalled();
    });
  });
});
