import { Watched, IWatched } from "../models";

class WatchedRepository {
  async create(watchedData: Partial<IWatched>): Promise<IWatched> {
    const watched = new Watched(watchedData);
    return await watched.save();
  }

  async findByUserId(userId: string): Promise<IWatched[]> {
    return await Watched.find({ userId });
  }

  async deleteByUserIdAndMovieId(
    userId: string,
    movieId: number,
  ): Promise<boolean> {
    const result = await Watched.findOneAndDelete({ userId, movieId });
    return result !== null;
  }

  async findByUserIdAndMovieId(
    userId: string,
    movieId: number,
  ): Promise<IWatched | null> {
    return await Watched.findOne({ userId, movieId });
  }

  async findAll(): Promise<IWatched[]> {
    return await Watched.find();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Watched.findByIdAndDelete(id);
    return result !== null;
  }

  async findById(id: string): Promise<IWatched | null> {
    return await Watched.findById(id);
  }

  async update(
    id: string,
    updateData: Partial<IWatched>,
  ): Promise<IWatched | null> {
    return await Watched.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByMovieId(movieId: number): Promise<IWatched[]> {
    return await Watched.find({ movieId });
  }
}

export default new WatchedRepository();
