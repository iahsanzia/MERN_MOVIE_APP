import { Request, Response } from "express";
import { MovieService } from "../services";
// type IdParams = { id: string };

class MovieController {
  async createMovie(req: Request, res: Response): Promise<void> {
    try {
      const movieData = req.body;

      if (!movieData.title) {
        res.status(400).json({
          status: "error",
          message: "Title is required",
        });
        return;
      }
      const movie = await MovieService.createMovie(movieData);

      res.status(201).json({
        status: "success",
        message: "Movie created Successfully",
        data: movie,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      const movies = await MovieService.getAllMovies();

      res.status(200).json({
        status: "success",
        message: "Movies retrieved successfully",
        data: movies,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async searchByTitle(req: Request, res: Response): Promise<void> {
    try {
      const { title } = req.query;

      if (!title) {
        res.status(400).json({
          status: "error",
          message: "Title is missing for search",
        });
        return;
      }

      const movies = await MovieService.searchMoviesByTitle(title as string);

      res.status(200).json({
        status: "success",
        message: "Movies found",
        data: movies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    try {
      const { genre } = req.query;

      if (!genre) {
        res.status(400).json({
          status: "error",
          message: "Genre is required for search",
        });
        return;
      }

      const movies = await MovieService.getMoviesByGenre(genre as string);

      res.status(200).json({
        status: "success",
        message: "Movies retrieved successfully",
        data: movies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getMoviesByDirector(req: Request, res: Response): Promise<void> {
    try {
      const { director } = req.query;

      if (!director) {
        res.status(400).json({
          status: "error",
          message: "Director is required for search",
        });
        return;
      }

      const movies = await MovieService.getMoviesByDirector(director as string);

      res.status(200).json({
        status: "success",
        message: "Movies Retrieved Successfully",
        data: movies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getMoviesByYear(req: Request, res: Response): Promise<void> {
    try {
      const { year } = req.query;

      if (!year) {
        res.status(400).json({
          status: "error",
          message: "Year is required for Search",
        });
        return;
      }

      const movies = await MovieService.getMoviesByReleaseYear(
        Number(year as string),
      );

      res.status(200).json({
        status: "success",
        message: "Movies retrieved successfully",
        data: movies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getFiltered(req: Request, res: Response): Promise<void> {
    try {
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
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateMovie(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const updateData = req.body;

      if (!movieId) {
        res.status(400).json({
          stauts: "error",
          message: "MovieId is required to update data",
        });
        return;
      }

      const updatedMovies = await MovieService.updateMovie(
        movieId as string,
        updateData,
      );

      if (!updatedMovies) {
        res.status(404).json({
          status: "error",
          message: "Movie not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Movie updated Successfully",
        data: updatedMovies,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteMovie(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;

      if (!movieId) {
        res.status(400).json({
          stauts: "error",
          message: "MovieId is required to update data",
        });
        return;
      }

      const deleted = await MovieService.deleteMovie(movieId as string);

      if (!deleted) {
        res.status(404).json({
          status: "error",
          message: "No movie found to be deleted",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "Movie deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new MovieController();
