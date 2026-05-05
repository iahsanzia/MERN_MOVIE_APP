import { Request, Response } from "express";
import { UserService } from "../services";
import { AppError } from "../utils";
type IdParams = { id: string };

class UserController {
  async getProfile(req: Request<IdParams>, res: Response): Promise<void> {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const user = await UserService.getUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: user,
    });
  }

  async updateProfile(req: Request<IdParams>, res: Response): Promise<void> {
    const userId = req.params.id;
    const { username, email } = req.body;

    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const updatedUser = await UserService.updateProfile(
      userId,
      username,
      email,
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      data: updatedUser,
    });
  }

  async updatePreferences(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {
    const userId = req.params.id;
    const { favoriteGenres, languages } = req.body;
    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const updatedUser = await UserService.updatePreferences(
      userId,
      favoriteGenres,
      languages,
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "User preferences updated successfully",
      data: updatedUser,
    });
  }

  async deleteProfile(req: Request<IdParams>, res: Response): Promise<void> {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError("UserID is required", 404);
    }
    const deletedUser = await UserService.deleteUser(userId);
    if (!deletedUser) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "User profile deleted successfully",
    });
  }
}

export default new UserController();
