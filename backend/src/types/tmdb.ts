export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  orignal_language: string;
  credits: {
    cast: Array<{ name: string; character: string }>;
    crew: Array<{ name: string; job: string }>;
  };
}

export interface TmdbSearchResponse {
  results: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  }>;
}

export interface TmdbTrendingResponse {
  results: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  }>;
}

export interface TmdbGenreResponse {
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export interface TmdbCreditsResponse {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    profile_path: string;
  }>;
}
export interface TmdbReviewsResponse {
  results: Array<{
    id: string;
    author: string;
    content: string;
    rating: number;
    url: string;
  }>;
}
