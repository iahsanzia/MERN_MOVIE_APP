import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  isWatched?: boolean;
  onAddToWatched: (movie: Movie) => void;
  onAddToFavorite: (movie: Movie) => void;
  onRemoveFromWatched?: (movie: Movie) => void;
  onRemoveFromFavorite?: (movie: Movie) => void;
  onMovieClick: (movie: Movie) => void;
  isRemovable?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite = false,
  isWatched = false,
  onAddToWatched,
  onAddToFavorite,
  onRemoveFromWatched,
  onRemoveFromFavorite,
  onMovieClick,
  isRemovable = false,
}) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const handleWatchedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRemovable && isWatched && onRemoveFromWatched) {
      onRemoveFromWatched(movie);
    } else {
      onAddToWatched(movie);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRemovable && isFavorite && onRemoveFromFavorite) {
      onRemoveFromFavorite(movie);
    } else {
      onAddToFavorite(movie);
    }
  };

  return (
    <div
      onClick={() => onMovieClick(movie)}
      className="relative group cursor-pointer flex-shrink-0 w-full"
      style={{ aspectRatio: '2/3' }}
    >
      {/* Poster Image */}
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
        {/* Top Icons */}
        <div className="flex justify-between">
          {/* Plus Icon (Watched) */}
          <button
            onClick={handleWatchedClick}
            className="bg-white rounded-full p-2 hover:bg-gray-200 transition"
          >
            {isWatched && isRemovable ? (
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>

          {/* Heart Icon (Favorite) */}
          <button
            onClick={handleFavoriteClick}
            className="bg-white rounded-full p-2 hover:bg-gray-200 transition"
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-600'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
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
          </button>
        </div>

        {/* Bottom Info */}
        <div className="bg-black bg-opacity-75 p-2 rounded">
          <h3 className="text-white font-semibold text-sm line-clamp-2">{movie.title}</h3>
          <div className="flex items-center gap-1 text-yellow-400 mt-1">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
