import React from "react";
import { MovieDetails, Favorite, Watched } from "../features/movies/types";

export interface MoviesContextType {
  selectedMovie: MovieDetails | null;
  setSelectedMovie: (movie: MovieDetails | null) => void;
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
  watched: Watched[];
  setWatched: (watched: Watched[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (favoriteId: string) => void;
  addWatched: (watched: Watched) => void;
  removeWatched: (watchedId: string) => void;
}

export const MoviesContext = React.createContext<MoviesContextType | undefined>(
  undefined,
);

export const useMoviesContext = (): MoviesContextType => {
  const context = React.useContext(MoviesContext);
  if (!context) {
    throw new Error("useMoviesContext must be used within MoviesProvider");
  }
  return context;
};
