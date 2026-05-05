import { Request, Response } from "express";
import { WatchedService } from "../services";

class WatchedController {
  async addToWatched(req: Request, res: Response): Promise<void> {
    try {
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
        res.status(400).json({
          status: "error",
          message: "userId, movieId, and title are required",
        });
        return;
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
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getAllWatched(_req: Request, res: Response): Promise<void> {
    try {
      const watchedMovies = await WatchedService.getAllWatched();

      res.status(200).json({
        status: "success",
        message: "All Movies Retrieved successfully",
        data: watchedMovies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getTopWatchedMovies(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const limitNum = limit ? Number(limit as string) : 10;

      const topMovies = await WatchedService.getTopWatchedMovies(limitNum);

      res.status(200).json({
        status: "success",
        message: "Top Movies Retrieved",
        data: topMovies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getUserRecentlyWatchedMovies(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit } = req.query;
      const limitNum = limit ? Number(limit as string) : 10;

      if (!userId) {
        res.status(404).json({
          status: "error",
          message: "UserID is required",
        });
        return;
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
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getUserWatchedCount(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(404).json({
          status: "error",
          message: "USERID is required",
        });
        return;
      }
      const count = await WatchedService.getUserWatchedCount(userId as string);

      res.status(200).json({
        status: "success",
        data: {
          movieCount: count,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getUserWatchedMovieSorted(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { order } = req.query;
      const normalizedOrder =
        order === "asc" || order === "desc"
          ? (order as "asc" | "desc")
          : undefined;

      if (!userId) {
        res.status(404).json({
          status: "error",
          message: "UserID is required",
        });
        return;
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
    } catch (error: any) {
      res.status(200).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getUserWatchedStats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(404).json({
          status: "error",
          message: "USERID is required",
        });
        return;
      }
      const stats = await WatchedService.getUserWatchedStatistics(
        userId as string,
      );

      res.status(200).json({
        status: "success",
        data: stats,
        message: "Stats received successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getWatchedByUserID(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(404).json({
          status: "error",
          message: "USERID is required",
        });
        return;
      }
      const watchedMovies = await WatchedService.getWatchedByUserId(
        userId as string,
      );
      res.status(200).json({
        status: "success",
        data: watchedMovies,
        message: "Movie Retrieved",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getWatchedCount(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.query;
      if (!movieId) {
        res.status(404).json({
          status: "error",
          message: "MovieID is required",
        });
        return;
      }
      const count = await WatchedService.getWatchedCount(Number(movieId));

      res.status(200).json({
        status: "success",
        data: {
          movieCount: count,
        },
        message: "Count received properly",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async isWatched(req: Request, res: Response): Promise<void> {
    try {
      const { userId, movieId } = req.query;
      if (!userId || !movieId) {
        res.status(404).json({
          status: "error",
          message: "USERID and MOVIEID is required",
        });
        return;
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
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async removedFromWatched(req: Request, res: Response): Promise<void> {
    try {
      const { userId, movieId } = req.query;
      if (!userId || !movieId) {
        res.status(400).json({
          status: "error",
          message: "USERID and MOVIEID is required",
        });
        return;
      }
      const removed = await WatchedService.removeFromWatched(
        userId as string,
        Number(movieId),
      );
      if (!removed) {
        res.status(400).json({
          status: "error",
          message: "NO Movie was found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "MOVIE was removed successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async removedFromWatchedById(req: Request, res: Response): Promise<void> {
    try {
      const { watchedId } = req.params;

      if (!watchedId) {
        res.status(404).json({
          status: "error",
          message: "WATHCEDID is required",
        });
        return;
      }
      const removed = await WatchedService.removeFromWatchedById(
        watchedId as string,
      );
      if (!removed) {
        res.status(404).json({
          status: "error",
          message: "No movie found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "Movie Removed",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async updateWatched(req: Request, res: Response): Promise<void> {
    try {
      const { watchedId } = req.params;
      const updateData = req.body;

      if (!watchedId) {
        res.status(400).json({
          status: "error",
          message: "WatchedID is required",
        });
        return;
      }
      const updatedMovie = await WatchedService.updateWatched(
        watchedId as string,
        updateData,
      );
      if (!updatedMovie) {
        res.status(404).json({
          status: "error",
          message: "Movie Not Found",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "Data Updated",
        data: updatedMovie,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new WatchedController();
