import { Request, Response } from "express";
import { UserService } from "../services";
type IdParams = { id: string };

class UserController {
  async getProfile(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({
          status: "error",
          message: "User ID is required",
        });
        return;
      }
      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "User profile retrieved successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async updateProfile(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const { username, email } = req.body;

      if (!userId) {
        res.status(400).json({
          status: "error",
          message: "User ID is required",
        });
        return;
      }
      const updatedUser = await UserService.updateProfile(
        userId,
        username,
        email,
      );

      if (!updatedUser) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "User profile updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async updatePreferences(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { favoriteGenres, languages } = req.body;
      if (!userId) {
        res.status(400).json({
          status: "error",
          message: "User ID is required",
        });
        return;
      }
      const updatedUser = await UserService.updatePreferences(
        userId,
        favoriteGenres,
        languages,
      );

      if (!updatedUser) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "User preferences updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async deleteProfile(req: Request<IdParams>, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({
          status: "error",
          message: "User ID is required",
        });
        return;
      }
      const deletedUser = await UserService.deleteUser(userId);
      if (!deletedUser) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "User profile deleted successfully",
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

export default new UserController();
