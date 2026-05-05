import { Router } from "express";
import { MovieController } from "../controllers";
import { catchAsync } from "../utils";

const router = Router();

router.post("/", catchAsync(MovieController.createMovie)); // POST /api/movies

router.get("/", catchAsync(MovieController.getAllMovies)); // GET /api/movies

router.get("/search", catchAsync(MovieController.searchByTitle)); // GET /api/movies/search?title=avatar

router.get("/genre", catchAsync(MovieController.getMoviesByGenre)); // GET /api/movies/genre?genre=action

router.get("/director", catchAsync(MovieController.getMoviesByDirector)); // GET /api/movies/director?director=james-cameron

router.get("/year", catchAsync(MovieController.getMoviesByYear)); // GET /api/movies/year?year=2009

router.get("/filter", catchAsync(MovieController.getFiltered)); // GET /api/movies/filter?genre=action&director=...&minRating=7&maxRating=9&releaseYear=2020
router.put("/:movieId", catchAsync(MovieController.updateMovie)); // PUT /api/movies/:movieId

router.delete("/:movieId", catchAsync(MovieController.deleteMovie)); // DELETE /api/movies/:movieId

export default router;
