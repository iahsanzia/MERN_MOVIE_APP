import { MovieDetails, Favorite, Watched } from "../../features/movies/types";

export interface MovieState {
  selectedMovie: MovieDetails | null;
  favorites: Favorite[];
  watched: Watched[];
}
