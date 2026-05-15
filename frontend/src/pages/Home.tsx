import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SearchBox } from "../features/movies/components/SearchBox";
import { MovieCarousel } from "../features/movies/components/MovieCarousel";
import { MovieDetailsModal } from "../features/movies/components/MovieDetailsModal";
import { useMovies } from "../features/movies/hooks/useMovies";
import { useUserMovies } from "../features/movies/hooks/useUserMovies";
import { useMovieActions } from "../features/movies/hooks/useMovieActions";
import { useSearchedMovies } from "../features/movies/hooks/useSearchedMovies";
import { Movie, MovieDetails } from "../features/movies/types";
import { movieService } from "../services/movieService";
import { showToast } from "../utils/toast";

export const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { trending, topRated, loading } = useMovies();
  const { favorites, watched, refetch } = useUserMovies(user?.id);
  const { addToFavorite, removeFromFavorite, addToWatched, removeFromWatched } =
    useMovieActions(user?.id);
  const { searchedMovies, refetch: refetchSearched } = useSearchedMovies(
    user?.id,
  );
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      showToast("Logged out successfully", "success");
    } catch (err) {
      showToast("Failed to logout", "error");
    }
  };

  const handlePreferences = () => {
    navigate("/preferences");
  };

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
      setMovieDetails(null);
    }
  };

  const handleRemoveFromFavorite = async () => {
    const favorite = favorites.find((f) => f.movieId === movieDetails?.id);
    if (favorite) {
      await removeFromFavorite(favorite._id);
      await refetch();
      setMovieDetails(null);
    }
  };

  const handleAddToWatched = async () => {
    if (movieDetails) {
      await addToWatched(movieDetails);
      await refetch();
      setMovieDetails(null);
    }
  };

  const handleRemoveFromWatched = async () => {
    const watchMovie = watched.find((w) => w.movieId === movieDetails?.id);
    if (watchMovie) {
      await removeFromWatched(watchMovie._id);
      await refetch();
      setMovieDetails(null);
    }
  };

  const handleMovieSuggestionSelect = async (movie: Movie) => {
    try {
      // Fetch full movie details from TMDB
      const fullDetails = await movieService.getMovieDetails(movie.id);

      // Prepare data for movie creation
      const movieData = {
        movieId: movie.id,
        title: fullDetails.title || movie.title,
        summary: fullDetails.overview || movie.overview,
        releaseDate: fullDetails.release_date || movie.release_date,
        posterPath: movie.poster_path,
        genres: (fullDetails.genres?.map((g: any) => g.name) || []) as string[],
        director: "Unknown", // TMDB API doesn't provide director in basic response
        cast: (fullDetails.credits?.cast?.slice(0, 5).map((c: any) => c.name) ||
          []) as string[],
        rating: fullDetails.vote_average || movie.vote_average,
      };

      console.log("Creating movie with data:", movieData);

      // Create movie in database
      await movieService.createMovie(movieData);
      showToast(`${movie.title} added to your collection!`, "success");

      // Refetch searched movies to display the newly created movie
      await refetchSearched();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.includes("already exists")
            ? "This movie is already in your collection"
            : err.message
          : "Failed to add movie to collection";
      showToast(message, "error");
    }
  };

  const favoriteIds = favorites.map((f) => f.movieId.toString());
  const watchedIds = watched.map((w) => w.movieId.toString());

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #8B0000 0%, #4a0000 15%, #1a0000 35%, #0d0000 55%, #000000 75%)",
      }}
    >
      {/* Header with User Info and Buttons */}
      <div className="flex justify-between items-center px-8 py-4 bg-black bg-opacity-50 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">🍿 PopinForMovies</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-white font-semibold">
              Welcome, {user.username}
            </span>
          )}
          <button
            onClick={handlePreferences}
            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            title="Preferences"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            title="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[320px] py-16 flex flex-col items-center justify-center px-4">
        {/* Red glow at top */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top, #e50914 0%, transparent 65%)",
          }}
        />
        <h1 className="relative text-5xl font-bold text-white mb-8 text-center drop-shadow-lg">
          Discover Movies
        </h1>
        <div className="relative w-full max-w-md">
          <SearchBox onMovieSuggestionSelect={handleMovieSuggestionSelect} />
        </div>
      </div>

      {/* Carousels */}
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

        {searchedMovies.length > 0 && (
          <MovieCarousel
            title="Searched Movies"
            movies={searchedMovies}
            onMovieClick={handleMovieClick}
            onAddToWatched={addToWatched}
            onAddToFavorite={addToFavorite}
            favorites={favoriteIds}
            watched={watchedIds}
          />
        )}

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
