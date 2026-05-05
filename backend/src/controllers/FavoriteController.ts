import { Request, Response } from "express";
import { FavoriteService } from "../services";

class FavoriteController {
  async createFavorite(req: Request, res: Response): Promise<void> {
    try {
      const {
        userId,
        movieId,
        title,
        summary,
        posterPath,
        releaseDate,
        rating,
      } = req.body;

      if (!title || !userId || !movieId) {
        res.status(400).json({
          status: "error",
          message: "Movie Title, ID and userID is required",
        });
        return;
      }

      const favorite = await FavoriteService.addToFavorites(userId, movieId, {
        summary,
        posterPath,
        releaseDate,
        rating,
        title,
      });

      res.status(200).json({
        status: "success",
        message: "Favorite Data retrieved",
        data: favorite,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getUserFavorites(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(404).json({
          status: "error",
          message: "UserId is required for search",
        });
        return;
      }

      const favorites = await FavoriteService.getFavoritesByUserId(
        userId as string,
      );

      res.status(200).json({
        status: "success",
        message: "Movies retrieved successfully",
        data: favorites,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async isFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, movieId } = req.query;

      if (!userId || !movieId) {
        res.status(404).json({
          status: "error",
          message: "User and Movie ID is required",
        });
        return;
      }

      const isFav = await FavoriteService.isFavorite(
        userId as string,
        Number(movieId),
      );

      res.status(200).json({
        status: "success",
        data: { isFavorite: isFav },
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async removeFromFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, movieId } = req.query;

      if (!userId || !movieId) {
        res.status(404).json({
          status: "error",
          message: "User and Movie ID is required",
        });
        return;
      }

      const removed = await FavoriteService.removeFromFavorites(
        userId as string,
        Number(movieId),
      );

      if (!removed) {
        res.status(404).json({
          status: "error",
          message: "Favorite not Found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "Movie removed from favorites",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getFavoriteCount(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;

      if (!movieId) {
        res.status(404).json({
          status: "error",
          message: "MovieID is required",
        });
        return;
      }

      const count = await FavoriteService.getFavoriteCount(Number(movieId));

      res.status(200).json({
        status: "success",
        message: "Count retrieved successfully",
        data: { favoriteCount: count },
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getUserFavoriteCount(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(404).json({
          status: "error",
          message: "UserID is required",
        });
        return;
      }

      const count = await FavoriteService.getUserFavoriteCount(
        userId as string,
      );

      res.status(200).json({
        status: "success",
        data: { userFavorite: count },
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getTopMovies(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const limitNum = limit ? Number(limit as string) : 10;

      const topMovies = await FavoriteService.getTopFavoritedMovies(limitNum);

      res.status(200).json({
        status: "success",
        message: "Top Movies Retrieved successfully",
        data: topMovies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async removeFromFavoritesById(req: Request, res: Response): Promise<void> {
    try {
      const { favoriteId } = req.params;
      if (!favoriteId) {
        res.status(404).json({
          status: "error",
          message: "FavoriteID is required",
        });
        return;
      }

      const removed = await FavoriteService.removeFromFavoritesById(
        favoriteId as string,
      );

      if (!removed) {
        res.status(404).json({
          status: "error",
          message: "Movie not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Favorite Movie has been removed",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getAllfavorites(_req: Request, res: Response): Promise<void> {
    try {
      const favorites = await FavoriteService.getAllFavorites();

      res.status(200).json({
        status: "success",
        message: "All favorites retrieved",
        data: favorites,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async updateFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { favoriteId } = req.params;
      const updateData = req.body;

      if (!favoriteId) {
        res.status(404).json({
          status: "error",
          message: "FavoriteID is required",
        });
        return;
      }
      const updatedFavorite = await FavoriteService.updateFavorite(
        favoriteId as string,
        updateData,
      );
      if (!updatedFavorite) {
        res.status(404).json({
          status: "error",
          message: "Favorite not found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "Favorite updated successfully",
        data: updatedFavorite,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new FavoriteController();
