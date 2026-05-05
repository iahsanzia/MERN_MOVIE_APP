import { Request, Response } from "express";
import { FavoriteService } from "../services";
import { AppError } from "../utils";

class FavoriteController {
  async createFavorite(req: Request, res: Response): Promise<void> {
    const { userId, movieId, title, summary, posterPath, releaseDate, rating } =
      req.body;

    if (!title || !userId || !movieId) {
      throw new AppError("Title, UserID, and MovieID is required", 400);
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
  }

  async getUserFavorites(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError("UserID is required", 400);
    }

    const favorites = await FavoriteService.getFavoritesByUserId(
      userId as string,
    );

    res.status(200).json({
      status: "success",
      message: "Movies retrieved successfully",
      data: favorites,
    });
  }

  async isFavorite(req: Request, res: Response): Promise<void> {
    const { userId, movieId } = req.query;

    if (!userId || !movieId) {
      throw new AppError("UserID and MovieID is required", 400);
    }

    const isFav = await FavoriteService.isFavorite(
      userId as string,
      Number(movieId),
    );

    res.status(200).json({
      status: "success",
      data: { isFavorite: isFav },
    });
  }

  async removeFromFavorite(req: Request, res: Response): Promise<void> {
    const { userId, movieId } = req.query;

    if (!userId || !movieId) {
      throw new AppError("UserID and MovieID is required", 400);
    }

    const removed = await FavoriteService.removeFromFavorites(
      userId as string,
      Number(movieId),
    );

    if (!removed) {
      throw new AppError("Favorite Movie not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Movie removed from favorites",
    });
  }

  async getFavoriteCount(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;

    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }

    const count = await FavoriteService.getFavoriteCount(Number(movieId));

    res.status(200).json({
      status: "success",
      message: "Count retrieved successfully",
      data: { favoriteCount: count },
    });
  }

  async getUserFavoriteCount(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError("UserID is required", 400);
    }

    const count = await FavoriteService.getUserFavoriteCount(userId as string);

    res.status(200).json({
      status: "success",
      data: { userFavorite: count },
    });
  }

  async getTopMovies(req: Request, res: Response): Promise<void> {
    const { limit } = req.query;
    const limitNum = limit ? Number(limit as string) : 10;

    const topMovies = await FavoriteService.getTopFavoritedMovies(limitNum);

    res.status(200).json({
      status: "success",
      message: "Top Movies Retrieved successfully",
      data: topMovies,
    });
  }

  async removeFromFavoritesById(req: Request, res: Response): Promise<void> {
    const { favoriteId } = req.params;
    if (!favoriteId) {
      throw new AppError("Favorite MovieID is required", 400);
    }

    const removed = await FavoriteService.removeFromFavoritesById(
      favoriteId as string,
    );

    if (!removed) {
      throw new AppError("Movie not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Favorite Movie has been removed",
    });
  }

  async getAllfavorites(_req: Request, res: Response): Promise<void> {
    const favorites = await FavoriteService.getAllFavorites();

    res.status(200).json({
      status: "success",
      message: "All favorites retrieved",
      data: favorites,
    });
  }
  async updateFavorite(req: Request, res: Response): Promise<void> {
    const { favoriteId } = req.params;
    const updateData = req.body;

    if (!favoriteId) {
      throw new AppError("Favorite Movie ID is required", 400);
    }
    const updatedFavorite = await FavoriteService.updateFavorite(
      favoriteId as string,
      updateData,
    );
    if (!updatedFavorite) {
      throw new AppError("Movie not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Favorite updated successfully",
      data: updatedFavorite,
    });
  }
}

export default new FavoriteController();
