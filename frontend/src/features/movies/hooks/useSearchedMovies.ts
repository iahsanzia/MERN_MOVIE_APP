import { useEffect, useState } from "react";
import { Movie } from "../types";
import { movieService } from "../../../services/movieService";
import { showToast } from "../../../utils/toast";

interface UseSearchedMoviesReturn {
  searchedMovies: Movie[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSearchedMovies = (
  userId: string | undefined,
): UseSearchedMoviesReturn => {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchedMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) {
        console.log("[useSearchedMovies] No userId provided, skipping fetch");
        setSearchedMovies([]);
        setLoading(false);
        return;
      }
      console.log("[useSearchedMovies] Fetching movies for userId:", userId);
      const movies = await movieService.getUserSearchedMovies(userId);
      console.log("Raw movies from API:", movies);
      const formattedMovies: Movie[] = movies.map((movie: any) => {
        console.log("Mapping movie:", {
          title: movie.title,
          posterPath: movie.posterPath,
          releaseDate: movie.releaseDate,
        });
        return {
          id: movie.movieId ? parseInt(movie.movieId) : 0,
          title: movie.title,
          poster_path: movie.posterPath || "",
          vote_average: movie.rating,
          overview: movie.summary,
          release_date: movie.releaseDate,
        };
      });
      console.log("Formatted movies:", formattedMovies);
      setSearchedMovies(formattedMovies);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch searched movies";
      console.error("[useSearchedMovies] Error:", message);
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchedMovies();
  }, [userId]);

  const refetch = async () => {
    await fetchSearchedMovies();
  };

  return { searchedMovies, loading, error, refetch };
};
