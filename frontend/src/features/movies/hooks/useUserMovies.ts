import { useEffect, useState, useCallback } from "react";
import { Favorite, Watched } from "../types";
import { movieService } from "../../../services/movieService";

interface UseUserMoviesReturn {
  favorites: Favorite[];
  watched: Watched[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserMovies = (
  userId: string | undefined,
): UseUserMoviesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [watched, setWatched] = useState<Watched[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserMovies = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      setWatched([]);
      return;
    }

    try {
      setLoading(true);
      const [favData, watchData] = await Promise.all([
        movieService.getUserFavorites(userId),
        movieService.getUserWatched(userId),
      ]);

      setFavorites(favData);
      setWatched(watchData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user movies",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserMovies();
  }, [fetchUserMovies]);

  return { favorites, watched, loading, error, refetch: fetchUserMovies };
};
