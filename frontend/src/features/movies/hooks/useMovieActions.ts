import { useState } from "react";
import { Movie } from "../types";
import { movieService } from "../../../services/movieService";
import { showToast } from "../../../utils/toast";
// import { useMoviesContext } from "../../../context/MoviesContext";
import { useAppDispatch } from "../../../store/slices/hooks";
import {
  addFavorite,
  removeFavorite,
  addWatched,
  removeWatched,
} from "../../../store/slices/movieSlice";
interface UseMovieActionsReturn {
  addToFavorite: (movie: Movie) => Promise<void>;
  removeFromFavorite: (favoriteId: string) => Promise<void>;
  addToWatched: (movie: Movie) => Promise<void>;
  removeFromWatched: (watchedId: string) => Promise<void>;
  loading: boolean;
}

export const useMovieActions = (
  userId: string | undefined,
): UseMovieActionsReturn => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const addToFavorite = async (movie: Movie) => {
    if (!userId) {
      showToast("User not authenticated", "error");
      return;
    }

    try {
      setLoading(true);
      const result = await movieService.addToFavorites(userId, {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        rating: movie.vote_average,
        summary: movie.overview,
        releaseDate: movie.release_date,
      });

      // addFavorite({
      //   _id: result._id,
      //   userId,
      //   movieId: movie.id,
      //   title: movie.title,
      //   posterPath: movie.poster_path,
      //   rating: movie.vote_average,
      //   summary: movie.overview,
      //   releaseDate: movie.release_date,
      // });
      dispatch(
        addFavorite({
          _id: result._id,
          userId,
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          rating: movie.vote_average,
          summary: movie.overview,
          releaseDate: movie.release_date,
        }),
      );

      showToast("Added to Favorites", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to add to favorites",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorite = async (favoriteId: string) => {
    try {
      setLoading(true);
      await movieService.removeFavorite(favoriteId);
      // removeFavorite(favoriteId);
      dispatch(removeFavorite(favoriteId));
      showToast("Removed from Favorites", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to remove from favorites",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const addToWatched = async (movie: Movie) => {
    if (!userId) {
      showToast("User not authenticated", "error");
      return;
    }

    try {
      setLoading(true);
      const result = await movieService.addToWatched(userId, {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        rating: movie.vote_average,
        summary: movie.overview,
        releaseDate: movie.release_date,
        cast: [],
      });

      // addWatched({
      //   _id: result._id,
      //   userId,
      //   movieId: movie.id,
      //   title: movie.title,
      //   posterPath: movie.poster_path,
      //   rating: movie.vote_average,
      //   summary: movie.overview,
      //   releaseDate: movie.release_date,
      // });
      dispatch(
        addWatched({
          _id: result._id,
          userId,
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          rating: movie.vote_average,
          summary: movie.overview,
          releaseDate: movie.release_date,
        }),
      );

      showToast("Added to Watched", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to add to watched",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatched = async (watchedId: string) => {
    try {
      setLoading(true);
      await movieService.removeWatched(watchedId);
      // removeWatched(watchedId);
      dispatch(removeWatched(watchedId));
      showToast("Removed from Watched", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to remove from watched",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    addToFavorite,
    removeFromFavorite,
    addToWatched,
    removeFromWatched,
    loading,
  };
};
