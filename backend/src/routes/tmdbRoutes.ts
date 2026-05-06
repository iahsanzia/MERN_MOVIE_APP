import { Router } from "express";
import { TmdbController } from "../controllers";
import { catchAsync } from "../utils";

const router = Router();

router.get("/search", catchAsync(TmdbController.searchMovies));

router.get("/movie/:movieId", catchAsync(TmdbController.getMovieDetails));

router.get("/trending", catchAsync(TmdbController.getTrendingMovies));

router.get("/top-rated", catchAsync(TmdbController.getTopRatedMovies));

router.get("/popular", catchAsync(TmdbController.getPopularMovies));

router.get("/by-genre", catchAsync(TmdbController.getMoviesByGenre));

router.get("/genres", catchAsync(TmdbController.getGenres));

router.get(
  "/movie/:movieId/recommendations",
  TmdbController.getRecommendations,
);

router.get("/movie/:movieId/similar", TmdbController.getSimilarMovies);

router.get("/movie/:movieId/credits", TmdbController.getCredits);

router.get("/movie/:movieId/reviews", TmdbController.getReviews);

export default router;
