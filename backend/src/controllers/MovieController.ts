import { Request, Response } from "express";
import { MovieService } from "../services";
import { AppError } from "../utils";

class MovieController {
  async createMovie(req: Request, res: Response): Promise<void> {
    const movieData = req.body;

    if (!movieData.title) {
      throw new AppError("Title is Required", 400);
    }
    const movie = await MovieService.createMovie(movieData);

    res.status(201).json({
      status: "success",
      message: "Movie created Successfully",
      data: movie,
    });
  }

  async getAllMovies(_req: Request, res: Response): Promise<void> {
    const movies = await MovieService.getAllMovies();

    res.status(200).json({
      status: "success",
      message: "Movies retrieved successfully",
      data: movies,
    });
  }
  async searchByTitle(req: Request, res: Response): Promise<void> {
    const { title } = req.query;

    if (!title) {
      throw new AppError("Title is Required", 400);
    }

    const movies = await MovieService.searchMoviesByTitle(title as string);

    res.status(200).json({
      status: "success",
      message: "Movies found",
      data: movies,
    });
  }

  async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    const { genre } = req.query;

    if (!genre) {
      throw new AppError("Genre is Required", 400);
    }

    const movies = await MovieService.getMoviesByGenre(genre as string);

    res.status(200).json({
      status: "success",
      message: "Movies retrieved successfully",
      data: movies,
    });
  }

  async getMoviesByDirector(req: Request, res: Response): Promise<void> {
    const { director } = req.query;

    if (!director) {
      throw new AppError("Director Name is required", 400);
    }

    const movies = await MovieService.getMoviesByDirector(director as string);

    res.status(200).json({
      status: "success",
      message: "Movies Retrieved Successfully",
      data: movies,
    });
  }

  async getMoviesByYear(req: Request, res: Response): Promise<void> {
    const { year } = req.query;

    if (!year) {
      throw new AppError("Release year is required", 400);
    }

    const movies = await MovieService.getMoviesByReleaseYear(
      Number(year as string),
    );

    res.status(200).json({
      status: "success",
      message: "Movies retrieved successfully",
      data: movies,
    });
  }

  async getFiltered(req: Request, res: Response): Promise<void> {
    const { genre, director, minRating, maxRating, releaseYear } = req.query;

    const filters = {
      genre: genre as string | undefined,
      director: director as string | undefined,
      minRating: minRating ? Number(minRating as string) : undefined,
      maxRating: maxRating ? Number(maxRating as string) : undefined,
      releaseYear: releaseYear ? Number(releaseYear as string) : undefined,
    };

    const movies = await MovieService.getFilteredMovies(
      filters.genre,
      filters.director,
      filters.releaseYear,
      filters.maxRating,
      filters.minRating,
    );

    res.status(200).json({
      status: "success",
      message: "Movies Filtered successfully",
      data: movies,
    });
  }

  async updateMovie(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;
    const updateData = req.body;

    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }

    const updatedMovies = await MovieService.updateMovie(
      movieId as string,
      updateData,
    );

    if (!updatedMovies) {
      throw new AppError("Movie not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Movie updated Successfully",
      data: updatedMovies,
    });
  }

  async deleteMovie(req: Request, res: Response): Promise<void> {
    const { movieId } = req.params;

    if (!movieId) {
      throw new AppError("MovieID is required", 400);
    }

    const deleted = await MovieService.deleteMovie(movieId as string);

    if (!deleted) {
      throw new AppError("Movie not found", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Movie deleted successfully",
    });
  }
}

export default new MovieController();
