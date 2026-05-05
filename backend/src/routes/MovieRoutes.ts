import { Router } from "express";
import { MovieController } from "../controllers";

const router = Router();

router.post("/", MovieController.createMovie); // POST /api/movies

router.get("/", MovieController.getAllMovies); // GET /api/movies

router.get("/search", MovieController.searchByTitle); // GET /api/movies/search?title=avatar

router.get("/genre", MovieController.getMoviesByGenre); // GET /api/movies/genre?genre=action

router.get("/director", MovieController.getMoviesByDirector); // GET /api/movies/director?director=james-cameron

router.get("/year", MovieController.getMoviesByYear); // GET /api/movies/year?year=2009

router.get("/filter", MovieController.getFiltered); // GET /api/movies/filter?genre=action&director=...&minRating=7&maxRating=9&releaseYear=2020

router.put("/:movieId", MovieController.updateMovie); // PUT /api/movies/:movieId

router.delete("/:movieId", MovieController.deleteMovie); // DELETE /api/movies/:movieId

export default router;
