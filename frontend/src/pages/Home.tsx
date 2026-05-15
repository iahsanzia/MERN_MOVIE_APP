import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SearchBox } from "../features/movies/components/SearchBox";
import { MovieCarousel } from "../features/movies/components/MovieCarousel";
import { MovieDetailsModal } from "../features/movies/components/MovieDetailsModal";
import { useMovies } from "../features/movies/hooks/useMovies";
import { useUserMovies } from "../features/movies/hooks/useUserMovies";
import { useMovieActions } from "../features/movies/hooks/useMovieActions";
import { Movie, MovieDetails } from "../features/movies/types";
import { movieService } from "../services/movieService";
import { showToast } from "../utils/toast";

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { trending, topRated, loading } = useMovies();
  const { favorites, watched, refetch } = useUserMovies(user?.id);
  const { addToFavorite, removeFromFavorite, addToWatched, removeFromWatched } =
    useMovieActions(user?.id);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  console.log("trending:", trending);
  console.log("topRated:", topRated);
  console.log("loading:", loading);

  const handleMovieClick = async (movie: Movie) => {
    try {
      const details = await movieService.getMovieDetails(movie.id);
      setMovieDetails(details);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch movie details";
      showToast(message, "error");
    }
  };

  const handleAddToFavorite = async () => {
    if (movieDetails) {
      await addToFavorite(movieDetails);
      await refetch();
    }
  };

  const handleRemoveFromFavorite = async () => {
    const favorite = favorites.find((f) => f.movieId === movieDetails?.id);
    if (favorite) {
      await removeFromFavorite(favorite._id);
      await refetch();
    }
  };

  const handleAddToWatched = async () => {
    if (movieDetails) {
      await addToWatched(movieDetails);
      await refetch();
    }
  };

  const handleRemoveFromWatched = async () => {
    const watchMovie = watched.find((w) => w.movieId === movieDetails?.id);
    if (watchMovie) {
      await removeFromWatched(watchMovie._id);
      await refetch();
    }
  };

  const favoriteIds = favorites.map((f) => f.movieId.toString());
  const watchedIds = watched.map((w) => w.movieId.toString());

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-96 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          Discover Movies
        </h1>
        <SearchBox />
      </div>

      <div className="px-4 pb-16">
        <MovieCarousel
          title="Trending Now"
          movies={trending}
          loading={loading}
          onMovieClick={handleMovieClick}
          onAddToWatched={addToWatched}
          onAddToFavorite={addToFavorite}
          favorites={favoriteIds}
          watched={watchedIds}
        />

        <MovieCarousel
          title="Top Rated"
          movies={topRated}
          loading={loading}
          onMovieClick={handleMovieClick}
          onAddToWatched={addToWatched}
          onAddToFavorite={addToFavorite}
          favorites={favoriteIds}
          watched={watchedIds}
        />

        {favorites.length > 0 && (
          <MovieCarousel
            title="My Favorites"
            movies={
              favorites.map((f) => ({
                id: f.movieId,
                title: f.title,
                poster_path: f.posterPath,
                vote_average: f.rating,
                overview: f.summary,
                release_date: f.releaseDate,
              })) as Movie[]
            }
            onMovieClick={handleMovieClick}
            onAddToWatched={() => {}}
            onAddToFavorite={() => {}}
            onRemoveFromFavorite={async (movie) => {
              const fav = favorites.find((f) => f.title === movie.title);
              if (fav) await removeFromFavorite(fav._id);
            }}
            isRemovable={true}
            favorites={favoriteIds}
            watched={watchedIds}
          />
        )}

        {watched.length > 0 && (
          <MovieCarousel
            title="My Watched"
            movies={
              watched.map((w) => ({
                id: w.movieId,
                title: w.title,
                poster_path: w.posterPath,
                vote_average: w.rating,
                overview: w.summary,
                release_date: w.releaseDate,
              })) as Movie[]
            }
            onMovieClick={handleMovieClick}
            onAddToWatched={() => {}}
            onAddToFavorite={() => {}}
            onRemoveFromWatched={async (movie) => {
              const w = watched.find((watch) => watch.title === movie.title);
              if (w) await removeFromWatched(w._id);
            }}
            isRemovable={true}
            favorites={favoriteIds}
            watched={watchedIds}
          />
        )}
      </div>

      <MovieDetailsModal
        movie={movieDetails}
        isOpen={!!movieDetails}
        onClose={() => setMovieDetails(null)}
        isFavorite={
          movieDetails
            ? favoriteIds.includes(movieDetails.id.toString())
            : false
        }
        isWatched={
          movieDetails ? watchedIds.includes(movieDetails.id.toString()) : false
        }
        onAddToFavorite={handleAddToFavorite}
        onRemoveFromFavorite={handleRemoveFromFavorite}
        onAddToWatched={handleAddToWatched}
        onRemoveFromWatched={handleRemoveFromWatched}
      />
    </div>
  );
};
