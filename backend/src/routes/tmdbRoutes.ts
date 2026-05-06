import { Router } from "express";
import { TmdbController } from "../controllers";
import { catchAsync } from "../utils";

const router = Router();

router.use((req, _res, next) => {
  console.log(`TMDB Route: ${req.method} ${req.path}`);
  next();
});

router.get("/search", catchAsync(TmdbController.searchMovies));

router.get("/movie/:movieId", catchAsync(TmdbController.getMovieDetails));

router.get("/trending", catchAsync(TmdbController.getTrendingMovies));

router.get("/top-rated", catchAsync(TmdbController.getTopRatedMovies));

router.get("/popular", catchAsync(TmdbController.getPopularMovies));

router.get("/by-genre", catchAsync(TmdbController.getMoviesByGenre));

router.get("/genres", catchAsync(TmdbController.getGenres));

router.get(
  "/movie/:movieId/recommendations",
  catchAsync(TmdbController.getRecommendations),
);

router.get(
  "/movie/:movieId/similar",
  catchAsync(TmdbController.getSimilarMovies),
);

router.get("/movie/:movieId/credits", catchAsync(TmdbController.getCredits));

router.get("/movie/:movieId/reviews", catchAsync(TmdbController.getReviews));

export default router;
