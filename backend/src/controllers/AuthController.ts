import { Request, Response } from "express";
import { AuthService, UserService } from "../services";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.status(400).json({
        status: "error",
        message: "Email, password and username are required",
      });
      return;
    }
    const { user, token } = await UserService.register(
      email,
      password,
      username,
    );
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
        token,
      },
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          status: "error",
          message: "Email and password are required",
        });
        return;
      }

      const { user, token } = await UserService.login(email, password);
      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
          token,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ status: "error", message: "Token is required" });
        return;
      }
      const decoded = await AuthService.verifyToken(token);

      if (!decoded) {
        res.status(401).json({ status: "error", message: "Invalid token" });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Token is valid",
        data: { userId: decoded.userId },
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default new AuthController();
