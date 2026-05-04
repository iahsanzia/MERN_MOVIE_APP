import { MovieRepository } from "../repositories";
import { IMovie } from "../models";

class MovieService {
  async createMovie(movieData: Partial<IMovie>): Promise<IMovie> {
    if (movieData.movieId) {
      const existingMovie = await MovieRepository.findByMovieId(
        movieData.movieId,
      );
      if (existingMovie) {
        throw new Error("Movie with this ID already exists");
      }
    }
    return await MovieRepository.create(movieData);
  }

  async getMovieById(movieId: string): Promise<IMovie | null> {
    return await MovieRepository.findByMovieId(movieId);
  }

  async getAllMovies(): Promise<IMovie[]> {
    return await MovieRepository.findAll();
  }
  async searchMoviesByTitle(title: string): Promise<IMovie[]> {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required for searching movies");
    }
    return await MovieRepository.searchByTitle(title);
  }

  async getMoviesByGenre(genre: string): Promise<IMovie[]> {
    if (!genre || genre.trim().length === 0) {
      throw new Error("Genre is required for searching movies");
    }
    return await MovieRepository.findByGenre(genre);
  }

  async getMoviesByDirector(director: string): Promise<IMovie[]> {
    if (!director || director.trim().length === 0) {
      throw new Error("Director is required for searching movies");
    }
    return await MovieRepository.findByDirector(director);
  }

  async getMoviesByReleaseYear(year: number): Promise<IMovie[]> {
    if (year < 1888 || year > new Date().getFullYear()) {
      throw new Error("Valid release year is required for searching movies");
    }
    return await MovieRepository.findByReleaseYear(year);
  }

  async updateMovie(
    movieId: string,
    updateData: Partial<IMovie>,
  ): Promise<IMovie | null> {
    const existingMovie = await MovieRepository.findByMovieId(movieId);
    if (!existingMovie) {
      throw new Error("Movie not found");
    }
    return await MovieRepository.update(movieId, updateData);
  }

  async deleteMovie(movieId: string): Promise<boolean> {
    const existingMovie = await MovieRepository.findByMovieId(movieId);
    if (!existingMovie) {
      throw new Error("Movie not found");
    }
    return await MovieRepository.delete(movieId);
  }

  async getMovieByTitle(title: string): Promise<IMovie | null> {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required for searching movies");
    }
    return await MovieRepository.findByTitle(title);
  }

  async getFilteredMovies(
    genre?: string,
    director?: string,
    releaseYear?: number,
    maxRating?: number,
    minRating?: number,
  ): Promise<IMovie[]> {
    let movies = await MovieRepository.findAll();
    if (genre) {
      movies = movies.filter((movie) => movie.genres.includes(genre));
    }
    if (director) {
      movies = movies.filter((movie) => movie.director === director);
    }
    if (releaseYear) {
      movies = movies.filter(
        (movie) => movie.releaseDate.getFullYear() === releaseYear,
      );
    }
    if (maxRating !== undefined) {
      movies = movies.filter((movie) => movie.rating <= maxRating);
    }
    if (minRating !== undefined) {
      movies = movies.filter((movie) => movie.rating >= minRating);
    }
    return movies;
  }
}

export default new MovieService();
