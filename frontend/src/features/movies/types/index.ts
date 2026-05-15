export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
  genre_ids?: number[];
  tmdbId?: number;
}

export interface MovieDetails extends Movie {
  runtime?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  revenue?: number;
  budget?: number;
}

export interface Favorite {
  _id: string;
  userId: string;
  movieId: number;
  title: string;
  posterPath: string;
  rating: number;
  summary: string;
  releaseDate?: string;
  addedAt?: string;
}

export interface Watched {
  _id: string;
  userId: string;
  movieId: number;
  title: string;
  posterPath: string;
  rating: number;
  summary: string;
  releaseDate?: string;
  genres?: string[];
  cast?: string[];
  watchedAt?: string;
}
