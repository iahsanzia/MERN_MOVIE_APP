import React from "react";
import { MovieDetails } from "../types";

interface MovieDetailsModalProps {
  movie: MovieDetails | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  isWatched?: boolean;
  onAddToWatched?: () => void;
  onAddToFavorite?: () => void;
  onRemoveFromWatched?: () => void;
  onRemoveFromFavorite?: () => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  isOpen,
  onClose,
  isFavorite = false,
  isWatched = false,
  onAddToWatched,
  onAddToFavorite,
  onRemoveFromWatched,
  onRemoveFromFavorite,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const handleWatchedClick = () => {
    if (isWatched && onRemoveFromWatched) {
      onRemoveFromWatched();
    } else if (onAddToWatched) {
      onAddToWatched();
    }
  };

  const handleFavoriteClick = () => {
    if (isFavorite && onRemoveFromFavorite) {
      onRemoveFromFavorite();
    } else if (onAddToFavorite) {
      onAddToFavorite();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-700 flex">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Poster */}
        <div className="w-48 h-full flex-shrink-0 bg-gray-900 rounded-l-lg overflow-hidden flex items-center justify-center">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-3 space-y-1 bg-gray-800 overflow-y-auto">
          {/* Title & Rating */}
          <div>
            <h2 className="text-xl font-bold text-white mb-0">{movie.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-yellow-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-base font-bold text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              {movie.release_date && (
                <span className="text-white">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <span className="text-white">{movie.runtime} min</span>
              )}
            </div>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-red-600 text-white px-2 py-1 rounded-full text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Summary */}
          {movie.overview && (
            <div>
              <h3 className="text-xs font-semibold text-white mb-0">Summary</h3>
              <p className="text-white text-xs line-clamp-2">
                {movie.overview}
              </p>
            </div>
          )}

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-white mb-0">Cast</h3>
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                {movie.credits.cast.slice(0, 5).map((actor) => (
                  <span
                    key={actor.id}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                  >
                    {actor.name}
                    {actor.character && ` as ${actor.character}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleWatchedClick}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition text-sm"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {isWatched ? "Remove from Watched" : "Add to Watched"}
            </button>

            <button
              onClick={handleFavoriteClick}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition text-sm"
            >
              <svg
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
