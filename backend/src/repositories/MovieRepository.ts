import { Movie, IMovie } from "../models";

class MovieRepository {
  async create(movieData: Partial<IMovie>): Promise<IMovie> {
    const movie = new Movie(movieData);
    return await movie.save();
  }

  async findByMovieId(movieId: string): Promise<IMovie | null> {
    return await Movie.findOne({ movieId });
  }

  async findAll(): Promise<IMovie[]> {
    return await Movie.find();
  }

  async update(
    movieId: string,
    updateData: Partial<IMovie>,
  ): Promise<IMovie | null> {
    return await Movie.findOneAndUpdate({ movieId }, updateData, { new: true });
  }

  async delete(movieId: string): Promise<boolean> {
    const result = await Movie.findOneAndDelete({ movieId });
    return result !== null;
  }

  async findByGenre(genre: string): Promise<IMovie[]> {
    return await Movie.find({ genres: genre });
  }

  async findByDirector(director: string): Promise<IMovie[]> {
    return await Movie.find({ director });
  }

  async findByReleaseYear(year: number): Promise<IMovie[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    return await Movie.find({ releaseDate: { $gte: startDate, $lt: endDate } });
  }

  async searchByTitle(title: string): Promise<IMovie[]> {
    return await Movie.find({ title: new RegExp(title, "i") });
  }

  async findByTitle(title: string): Promise<IMovie | null> {
    return await Movie.findOne({ title });
  }
}

export default new MovieRepository();
