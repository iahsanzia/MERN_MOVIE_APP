import { Favorite, IFavorite } from "../models";

class FavoriteRepository {
  async create(favoriteData: Partial<IFavorite>): Promise<IFavorite> {
    const favorite = new Favorite(favoriteData);
    return await favorite.save();
  }

  async findByUserId(userId: string): Promise<IFavorite[]> {
    return await Favorite.find({ userId });
  }

  async deleteByUserIdAndMovieId(
    userId: string,
    movieId: number,
  ): Promise<boolean> {
    const result = await Favorite.findOneAndDelete({ userId, movieId });
    return result !== null;
  }

  async findByUserIdAndMovieId(
    userId: string,
    movieId: number,
  ): Promise<IFavorite | null> {
    return await Favorite.findOne({ userId, movieId });
  }

  async findAll(): Promise<IFavorite[]> {
    return await Favorite.find();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Favorite.findByIdAndDelete(id);
    return result !== null;
  }

  async findById(id: string): Promise<IFavorite | null> {
    return await Favorite.findById(id);
  }

  async update(
    id: string,
    updateData: Partial<IFavorite>,
  ): Promise<IFavorite | null> {
    return await Favorite.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByMovieId(movieId: number): Promise<IFavorite[]> {
    return await Favorite.find({ movieId });
  }
}

export default new FavoriteRepository();
