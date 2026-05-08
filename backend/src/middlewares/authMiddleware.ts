import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";
import { AppError } from "../utils";

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No Token provided. Authorization required", 401);
    }

    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      throw new AppError("Invalid or expired Token", 401);
    }
    req.userId = decoded.userId;
    req.email = decoded.email;

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Authentication Error",
      });
    }
  }
};
