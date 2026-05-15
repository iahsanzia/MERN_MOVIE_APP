import React, { useState } from "react";
import { Movie } from "../types";
import { MovieCard } from "./MovieCard";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMovieClick: (movie: Movie) => void;
  onAddToWatched: (movie: Movie) => void;
  onAddToFavorite: (movie: Movie) => void;
  onRemoveFromWatched?: (movie: Movie) => void;
  onRemoveFromFavorite?: (movie: Movie) => void;
  isRemovable?: boolean;
  favorites?: string[];
  watched?: string[];
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  loading = false,
  onMovieClick,
  onAddToWatched,
  onAddToFavorite,
  onRemoveFromWatched,
  onRemoveFromFavorite,
  isRemovable = false,
  favorites = [],
  watched = [],
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = 400;
    let newPosition = scrollPosition;
    const maxScroll =
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

    if (direction === "left") {
      newPosition = Math.max(0, scrollPosition - scrollAmount);
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
    }

    carouselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-white text-2xl font-bold mb-4 px-4">{title}</h2>

      <div className="relative group">
        {/* Left Navigation Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-hidden px-4 py-4 scroll-smooth"
        >
          {loading
            ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 h-60 bg-gray-700 rounded-lg animate-pulse"
                />
              ))
            : movies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-40">
                  <MovieCard
                    movie={movie}
                    isFavorite={favorites.includes(movie.id.toString())}
                    isWatched={watched.includes(movie.id.toString())}
                    onAddToWatched={onAddToWatched}
                    onAddToFavorite={onAddToFavorite}
                    onRemoveFromWatched={onRemoveFromWatched}
                    onRemoveFromFavorite={onRemoveFromFavorite}
                    onMovieClick={onMovieClick}
                    isRemovable={isRemovable}
                  />
                </div>
              ))}
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
