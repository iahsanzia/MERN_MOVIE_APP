import { Request, Response } from "express";
import { AuthService, UserService } from "../services";
import { AppError } from "../utils";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      throw new AppError("Email,Password and Username are required", 400);
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
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and Password are required", 400);
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
  }
  async verifyToken(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError("Token is required", 401);
    }
    const decoded = await AuthService.verifyToken(token);

    if (!decoded) {
      throw new AppError("Invalid Token", 401);
    }

    res.status(200).json({
      status: "success",
      message: "Token is valid",
      data: { userId: decoded.userId },
    });
  }
}

export default new AuthController();
