import { Request, Response } from "express";
import { TmdbService } from "../services";
import { AppError } from "../utils";

class TmdbController {
  async searchMovies(req: Request, res: Response): Promise<void> {
    const { query, page } = req.query;
    if (!query) {
      throw new AppError("Search Query is required", 400);
    }
    const result = await TmdbService.searchMovies(
      query as string,
      Number(page),
    );

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
    const genres = await TmdbService.getGenres();

    res.status(200).json({
      status: "success",
      message: "Genres recieved",
      data: genres,
    });
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
