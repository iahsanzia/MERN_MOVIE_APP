import { useEffect, useCallback, useState } from "react";
import { movieService } from "../../../services/movieService";
import { useAppDispatch } from "../../../store/slices/hooks";
import { setFavorites, setWatched } from "../../../store/slices/movieSlice";

interface UseUserMoviesReturn {
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserMovies = (
  userId: string | undefined,
): UseUserMoviesReturn => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserMovies = useCallback(async () => {
    if (!userId) {
      dispatch(setFavorites([]));
      dispatch(setWatched([]));
      return;
    }

    try {
      setLoading(true);
      const [favData, watchData] = await Promise.all([
        movieService.getUserFavorites(userId),
        movieService.getUserWatched(userId),
      ]);

      dispatch(setFavorites(favData)); // ← seeds Redux
      dispatch(setWatched(watchData)); // ← seeds Redux
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user movies",
      );
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchUserMovies();
  }, [fetchUserMovies]);

  return { loading, error, refetch: fetchUserMovies };
};
