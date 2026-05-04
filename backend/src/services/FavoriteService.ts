import { FavoriteRepository } from "../repositories";
import { IFavorite } from "../models";
import mongoose from "mongoose";

class FavoriteService {
  async addToFavorites(
    userId: string,
    movieId: number,
    movieData: Partial<IFavorite>,
  ): Promise<IFavorite> {
    const existingFavorite = await FavoriteRepository.findByUserIdAndMovieId(
      userId,
      movieId,
    );
    if (existingFavorite) {
      throw new Error("Movie is already in favorites");
    }
    const favoriteData: Partial<IFavorite> = {
      userId: new mongoose.Types.ObjectId(userId),
      movieId,
      ...movieData,
      addedAt: new Date(),
    };
    return await FavoriteRepository.create(favoriteData);
  }

  async getFavoritesByUserId(userId: string): Promise<IFavorite[]> {
    return await FavoriteRepository.findByUserId(userId);
  }

  async isFavorite(userId: string, movieId: number): Promise<boolean> {
    const favorite = await FavoriteRepository.findByUserIdAndMovieId(
      userId,
      movieId,
    );
    return favorite !== null;
  }

  async removeFromFavorites(userId: string, movieId: number): Promise<boolean> {
    const deleted = await FavoriteRepository.deleteByUserIdAndMovieId(
      userId,
      movieId,
    );
    if (!deleted) {
      throw new Error("Favorite not found");
    }
    return await FavoriteRepository.deleteByUserIdAndMovieId(userId, movieId);
  }

  async removeFromFavoritesById(favoriteId: string): Promise<boolean> {
    const deleted = await FavoriteRepository.deleteById(favoriteId);
    if (!deleted) {
      throw new Error("Favorite not found");
    }
    return await FavoriteRepository.deleteById(favoriteId);
  }

  async getFavoriteCount(movieId: number): Promise<number> {
    const favorites = await FavoriteRepository.findByMovieId(movieId);
    return favorites.length;
  }

  async getUserFavoriteCount(userId: string): Promise<number> {
    const favorites = await FavoriteRepository.findByUserId(userId);
    return favorites.length;
  }

  async getAllFavorites(): Promise<IFavorite[]> {
    return await FavoriteRepository.findAll();
  }

  async updateFavorite(
    favoriteId: string,
    updateData: Partial<IFavorite>,
  ): Promise<IFavorite | null> {
    const existingFavorite = await FavoriteRepository.findById(favoriteId);
    if (!existingFavorite) {
      throw new Error("Favorite not found");
    }
    return await FavoriteRepository.update(favoriteId, updateData);
  }
  async getTopFavoritedMovies(
    limit: number,
  ): Promise<{ movieId: number; count: number }[]> {
    const favorites = await FavoriteRepository.findAll();
    const movieCountMap: { [key: number]: IFavorite[] } = {};

    favorites.forEach((favorite) => {
      if (!movieCountMap[favorite.movieId]) {
        movieCountMap[favorite.movieId] = [];
      }
      movieCountMap[favorite.movieId]?.push(favorite);
    });

    const sortedMovies = Object.entries(movieCountMap)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, limit)
      .map(([movieId, favorites]) => ({
        movieId: Number(movieId),
        count: favorites.length,
      }));

    return sortedMovies;
  }
}

export default new FavoriteService();
