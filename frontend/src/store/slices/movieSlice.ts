import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MovieDetails, Favorite, Watched } from "../../features/movies/types";

interface MovieState {
  selectedMovie: MovieDetails | null;
  favorites: Favorite[];
  watched: Watched[];
}

const initialState: MovieState = {
  selectedMovie: null,
  favorites: [],
  watched: [],
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<MovieDetails | null>) => {
      state.selectedMovie = action.payload;
    },
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.favorites = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (fav) => fav._id !== action.payload,
      );
    },
    setWatched: (state, action: PayloadAction<Watched[]>) => {
      state.watched = action.payload;
    },
    addWatched: (state, action: PayloadAction<Watched>) => {
      state.watched.push(action.payload);
    },
    removeWatched: (state, action: PayloadAction<string>) => {
      state.watched = state.watched.filter(
        (watch) => watch._id !== action.payload,
      );
    },
  },
});

export const {
  setSelectedMovie,
  setFavorites,
  addFavorite,
  removeFavorite,
  setWatched,
  addWatched,
  removeWatched,
} = movieSlice.actions;
export default movieSlice.reducer;
