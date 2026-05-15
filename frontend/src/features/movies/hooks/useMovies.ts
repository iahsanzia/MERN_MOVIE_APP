import { useEffect, useState } from "react";
import { Movie } from "../types";
import { movieService } from "../../../services/movieService";

interface UseMoviesReturn {
  trending: Movie[];
  topRated: Movie[];
  loading: boolean;
  error: string | null;
}

export const useMovies = (): UseMoviesReturn => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [trendingData, topRatedData] = await Promise.all([
          movieService.getTrendingMovies(),
          movieService.getTopRatedMovies(),
        ]);

        setTrending(trendingData.slice(0, 15));
        setTopRated(topRatedData.slice(0, 15));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { trending, topRated, loading, error };
};
