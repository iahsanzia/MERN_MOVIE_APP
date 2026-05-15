import React, { useState } from "react";
import { MoviesContext } from "./MoviesContext";
import { MovieDetails, Favorite, Watched } from "../features/movies/types";

interface MoviesProviderProps {
  children: React.ReactNode;
}

export const MoviesProvider: React.FC<MoviesProviderProps> = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [watched, setWatched] = useState<Watched[]>([]);

  const addFavorite = (favorite: Favorite) => {
    setFavorites((prev) => [...prev, favorite]);
  };

  const removeFavorite = (favoriteId: string) => {
    setFavorites((prev) => prev.filter((f) => f._id !== favoriteId));
  };

  const addWatched = (watchedMovie: Watched) => {
    setWatched((prev) => [...prev, watchedMovie]);
  };

  const removeWatched = (watchedId: string) => {
    setWatched((prev) => prev.filter((w) => w._id !== watchedId));
  };

  const value = {
    selectedMovie,
    setSelectedMovie,
    favorites,
    setFavorites,
    watched,
    setWatched,
    addFavorite,
    removeFavorite,
    addWatched,
    removeWatched,
  };

  return (
    <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>
  );
};
