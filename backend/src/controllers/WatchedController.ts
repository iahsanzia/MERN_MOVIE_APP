import { Request, Response } from "express";
import { WatchedService } from "../services";
import { AppError } from "../utils";

class WatchedController {
  async addToWatched(req: Request, res: Response): Promise<void> {
    const {
      userId,
      movieId,
      title,
      posterPath,
      releaseDate,
      rating,
      summary,
      cast,
    } = req.body;

    if (!userId || !movieId || !title) {
      throw new AppError("UserID, MovieID, and Title is required", 400);
    }

    const wathced = await WatchedService.addToWatched(
      userId as string,
      Number(movieId),
      {
        title,
        posterPath,
        releaseDate,
        rating,
        summary,
        cast,
      },
    );

    res.status(200).json({
      status: "success",
      message: "Wathced movie created successfully",
      data: wathced,
    });
  }
  async getAllWatched(_req: Request, res: Response): Promise<void> {
    const watchedMovies = await WatchedService.getAllWatched();

    res.status(200).json({
      status: "success",
      message: "All Movies Retrieved successfully",
      data: watchedMovies,
    });
  }
  async getTopWatchedMovies(req: Request, res: Response): Promise<void> {
    const { limit } = req.query;
    const limitNum = limit ? Number(limit as string) : 10;

    const topMovies = await WatchedService.getTopWatchedMovies(limitNum);

    res.status(200).json({
      status: "success",
      message: "Top Movies Retrieved",
      data: topMovies,
    });
  }
  async getUserRecentlyWatchedMovies(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = req.params;
    const { limit } = req.query;
    const limitNum = limit ? Number(limit as string) : 10;

    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const recentlyWatched = await WatchedService.getUserRecentlyWatched(
      userId as string,
      limitNum,
    );

    res.status(200).json({
      status: "success",
      message: "Recently watched Movie Retrieved",
      data: recentlyWatched,
    });
  }
  async getUserWatchedCount(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const count = await WatchedService.getUserWatchedCount(userId as string);

    res.status(200).json({
      status: "success",
      data: {
        movieCount: count,
      },
    });
  }
  async getUserWatchedMovieSorted(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { order } = req.query;
    const normalizedOrder =
      order === "asc" || order === "desc"
        ? (order as "asc" | "desc")
        : undefined;

    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const sortedMovies = await WatchedService.getUserWatchedMoviesSorted(
      userId as string,
      normalizedOrder,
    );

    res.status(200).json({
      status: "success",
      data: sortedMovies,
      message: "Sorted Movies retrieved",
    });
  }

  async getUserWatchedStats(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const stats = await WatchedService.getUserWatchedStatistics(
      userId as string,
    );

    res.status(200).json({
      status: "success",
      data: stats,
      message: "Stats received successfully",
    });
  }
  async getWatchedByUserID(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError("UserID is required", 400);
    }
    const watchedMovies = await WatchedService.getWatchedByUserId(
      userId as string,
    );
    res.status(200).json({
      status: "success",
      data: watchedMovies,
      message: "Movie Retrieved",
    });
  }

  async getWatchedCount(req: Request, res: Response): Promise<void> {
    const { movieId } = req.query;
    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }
    const count = await WatchedService.getWatchedCount(Number(movieId));

    res.status(200).json({
      status: "success",
      data: {
        movieCount: count,
      },
      message: "Count received properly",
    });
  }

  async isWatched(req: Request, res: Response): Promise<void> {
    const { userId, movieId } = req.query;
    if (!userId || !movieId) {
      throw new AppError("UserID and MovieID is required", 400);
    }
    const isWatched = await WatchedService.isWatched(
      userId as string,
      Number(movieId),
    );
    res.status(200).json({
      status: "success",
      data: {
        isWatchedMovie: isWatched,
      },
    });
  }
  async removedFromWatched(req: Request, res: Response): Promise<void> {
    const { userId, movieId } = req.query;
    if (!userId || !movieId) {
      throw new AppError("UserID and MovieID is required", 400);
    }
    const removed = await WatchedService.removeFromWatched(
      userId as string,
      Number(movieId),
    );
    if (!removed) {
      throw new AppError("Movie not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "MOVIE was removed successfully",
    });
  }
  async removedFromWatchedById(req: Request, res: Response): Promise<void> {
    const { watchedId } = req.params;

    if (!watchedId) {
      throw new AppError("WatchID is required", 400);
    }
    const removed = await WatchedService.removeFromWatchedById(
      watchedId as string,
    );
    if (!removed) {
      throw new AppError("Movie not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Movie Removed",
    });
  }
  async updateWatched(req: Request, res: Response): Promise<void> {
    const { watchedId } = req.params;
    const updateData = req.body;

    if (!watchedId) {
      throw new AppError("WatchID is required", 400);
    }
    const updatedMovie = await WatchedService.updateWatched(
      watchedId as string,
      updateData,
    );
    if (!updatedMovie) {
      throw new AppError("Movie not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Data Updated",
      data: updatedMovie,
    });
  }
}

export default new WatchedController();
