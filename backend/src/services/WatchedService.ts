import { WatchedRepository } from "../repositories";
import { IWatched } from "../models";
import mongoose from "mongoose";

class WatchedService {
  async addToWatched(
    userId: string,
    movieId: number,
    movieData: Partial<IWatched>,
  ): Promise<IWatched> {
    const existingWatched = await WatchedRepository.findByUserIdAndMovieId(
      userId,
      movieId,
    );
    if (existingWatched) {
      throw new Error("Movie is already in watched list");
    }
    const watchedData: Partial<IWatched> = {
      userId: new mongoose.Types.ObjectId(userId),
      movieId,
      ...movieData,
      WatchedAt: new Date(),
    };
    return await WatchedRepository.create(watchedData);
  }

  async getWatchedByUserId(userId: string): Promise<IWatched[]> {
    return await WatchedRepository.findByUserId(userId);
  }

  async isWatched(userId: string, movieId: number): Promise<boolean> {
    const watched = await WatchedRepository.findByUserIdAndMovieId(
      userId,
      movieId,
    );
    return watched !== null;
  }

  async removeFromWatched(userId: string, movieId: number): Promise<boolean> {
    const deleted = await WatchedRepository.deleteByUserIdAndMovieId(
      userId,
      movieId,
    );
    if (!deleted) {
      throw new Error("Watched entry not found");
    }
    return await WatchedRepository.deleteByUserIdAndMovieId(userId, movieId);
  }
  async removeFromWatchedById(watchedId: string): Promise<boolean> {
    const deleted = await WatchedRepository.deleteById(watchedId);
    if (!deleted) {
      throw new Error("Watched entry not found");
    }
    return await WatchedRepository.deleteById(watchedId);
  }

  async getWatchedCount(movieId: number): Promise<number> {
    const watchedEntries = await WatchedRepository.findByMovieId(movieId);
    return watchedEntries.length;
  }

  async getUserWatchedCount(userId: string): Promise<number> {
    const watchedEntries = await WatchedRepository.findByUserId(userId);
    return watchedEntries.length;
  }

  async getAllWatched(): Promise<IWatched[]> {
    return await WatchedRepository.findAll();
  }

  async updateWatched(
    watchedId: string,
    updateData: Partial<IWatched>,
  ): Promise<IWatched | null> {
    const existingWatched = await WatchedRepository.findById(watchedId);
    if (!existingWatched) {
      throw new Error("Watched entry not found");
    }
    return await WatchedRepository.update(watchedId, updateData);
  }

  async getUserRecentlyWatched(
    userId: string,
    limit: number = 10,
  ): Promise<IWatched[]> {
    const watchedEntries = await WatchedRepository.findByUserId(userId);
    return watchedEntries
      .sort((a, b) => b.WatchedAt.getTime() - a.WatchedAt.getTime())
      .slice(0, limit);
  }

  async getTopWatchedMovies(
    limit: number,
  ): Promise<{ movieId: number; count: number }[]> {
    const watchedEntries = await WatchedRepository.findAll();
    const movieCountMap: { [key: number]: IWatched[] } = {};
    watchedEntries.forEach((watched) => {
      if (!movieCountMap[watched.movieId]) {
        movieCountMap[watched.movieId] = [];
      }
      movieCountMap[watched.movieId]?.push(watched);
    });

    const sortedMovies = Object.entries(movieCountMap)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, limit)
      .map(([movieId, watchedList]) => ({
        movieId: parseInt(movieId),
        count: watchedList.length,
      }));

    return sortedMovies;
  }

  async getUserWatchedMoviesSorted(
    userId: string,
    order: "asc" | "desc" = "desc",
  ): Promise<IWatched[]> {
    const watchedEntries = await WatchedRepository.findByUserId(userId);
    return watchedEntries.sort((a, b) => {
      if (order === "asc") {
        return a.WatchedAt.getTime() - b.WatchedAt.getTime();
      } else {
        return b.WatchedAt.getTime() - a.WatchedAt.getTime();
      }
    });
  }
  async getUserWatchedStatistics(userId: string): Promise<{
    totalWatched: number;
    averageRating: number;
    lastWatched: Date | null;
  }> {
    const watchedEntries = await WatchedRepository.findByUserId(userId);
    if (watchedEntries.length === 0) {
      return {
        totalWatched: 0,
        averageRating: 0,
        lastWatched: null,
      };
    }
    const totalWatched = watchedEntries.length;
    const averageRating =
      watchedEntries.reduce((sum, entry) => sum + (entry.rating || 0), 0) /
      totalWatched;
    const lastWatched = watchedEntries.reduce((latest, entry) => {
      return new Date(entry.WatchedAt) > new Date(latest.WatchedAt)
        ? entry
        : latest;
    }).WatchedAt;
    return {
      totalWatched,
      averageRating: Math.round(averageRating * 10) / 10,
      lastWatched,
    };
  }
}
