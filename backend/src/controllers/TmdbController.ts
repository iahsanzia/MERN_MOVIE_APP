import { Request, Response } from "express";

import { AppError } from "../utils";

// console.log(" TmdbController file loading...");

// try {
//   const { TmdbService } = require("../services");
//   console.log(" TmdbService imported:", TmdbService);
// } catch (error: any) {
//   console.error(" Error importing TmdbService:", error.message);
// }
import { TmdbService } from "../services";
console.log(`In the controller:`);

// console.log("TmdbService value:", TmdbService);

class TmdbController {
  async searchMovies(req: Request, res: Response): Promise<void> {
    console.log(`Inside the controller:`);
    const { query, page } = req.query;
    const pageNumber = page ? Number(page) : 1;
    if (!query || (query as string).trim() === "") {
      throw new AppError("Search Query is required", 400);
    }
    const result = await TmdbService.searchMovies(query as string, pageNumber);

    res.status(200).json({
      status: "success",
      message: "Movies found on TMDB",
      data: result,
    });
  }
  async getMovieDetails(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;
    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }
    const movie = await TmdbService.getMovieDetails(Number(movieId));

    res.status(200).json({
      status: "success",
      message: "Movie Details retrieved",
      data: movie,
    });
  }
  async getTrendingMovies(req: Request, res: Response): Promise<void> {
    const { timeWindow } = req.query;
    const window = (timeWindow as "day" | "week") || "week";

    const trending = await TmdbService.getTrendingMovies(window);
    res.status(200).json({
      status: "success",
      message: "Trending Movies Retrieved",
      data: trending,
    });
  }

  async getTopRatedMovies(req: Request, res: Response): Promise<void> {
    const { page } = req.query;

    const topMovies = await TmdbService.getTopRatedMovies(Number(page));

    res.status(200).json({
      status: "success",
      message: "Top Movies Retrieved",
      data: topMovies,
    });
  }
  async getPopularMovies(req: Request, res: Response): Promise<void> {
    const { page } = req.query;

    const popularMovies = await TmdbService.getPopularMovie(Number(page));

    res.status(200).json({
      status: "success",
      message: "Popular Movies retrieved",
      data: popularMovies,
    });
  }

  async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    const { genreId, page } = req.query;

    if (!genreId) {
      throw new AppError("GenreID is required", 400);
    }
    const movies = await TmdbService.getMoviesByGenre(
      Number(genreId),
      Number(page),
    );

    res.status(200).json({
      status: "success",
      message: "Movies By Genres retrieved",
      data: movies,
    });
  }
  async getGenres(_req: Request, res: Response): Promise<void> {
    console.log("TmdbController: getGenres called");
    try {
      const genres = await TmdbService.getGenres();
      console.log("TmdbController: Genres received from service", genres);

      res.status(200).json({
        status: "success",
        message: "Genres recieved",
        data: genres,
      });
    } catch (error) {
      console.error("TmdbController: Error in getGenres", error);
      throw error;
    }
  }

  async getLanguages(_req: Request, res: Response): Promise<void> {
    console.log("TmdbController: getLanguages called");
    try {
      const languages = await TmdbService.getLanguages();
      console.log("TmdbController: Languages received from service");

      res.status(200).json({
        status: "success",
        message: "Languages received",
        data: languages,
      });
    } catch (error) {
      console.error("TmdbController: Error in getLanguages", error);
      throw error;
    }
  }

  async getRecommendations(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;

    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }

    const recommendations = await TmdbService.getRecommendations(
      Number(movieId),
    );
    res.status(200).json({
      status: "success",
      message: "Recommendations Retrieved",
      data: recommendations,
    });
  }

  async getSimilarMovies(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;

    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }

    const similarMovies = await TmdbService.getSimilarMovies(Number(movieId));

    res.status(200).json({
      status: "success",
      message: "Similar Movies retrieved",
      data: similarMovies,
    });
  }

  async getCredits(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;
    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }

    const credits = await TmdbService.getCredits(Number(movieId));

    res.status(200).json({
      status: "success",
      message: "Credits Retrieved",
      data: credits,
    });
  }
  async getReviews(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;

    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }
    const reviews = await TmdbService.getReviews(Number(movieId));

    res.status(200).json({
      status: "success",
      message: "Reviews Retrieved",
      data: reviews,
    });
  }
}

export default new TmdbController();
