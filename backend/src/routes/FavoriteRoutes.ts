import { Router } from "express";
import { FavoriteController } from "../controllers";
import { catchAsync } from "../utils";

const router = Router();

router.post("/", catchAsync(FavoriteController.createFavorite)); // POST /api/favorites

router.get("/user/:userId", catchAsync(FavoriteController.getUserFavorites)); // GET /api/favorites/user/:userId

router.get("/check", catchAsync(FavoriteController.isFavorite)); // GET /api/favorites/check?userId=123&movieId=238

router.get("/count/:movieId", catchAsync(FavoriteController.getFavoriteCount)); // GET /api/favorites/count/:movieId

router.get(
  "/user-count/:userId",
  catchAsync(FavoriteController.getUserFavoriteCount),
); // GET /api/favorites/user-count/:userId

router.get("/top", catchAsync(FavoriteController.getTopMovies)); // GET /api/favorites/top?limit=10

router.get("/all", catchAsync(FavoriteController.getAllfavorites)); // GET /api/favorites/all

router.put("/:favoriteId", catchAsync(FavoriteController.updateFavorite)); // PUT /api/favorites/:favoriteId

router.delete(
  "/:favoriteId",
  catchAsync(FavoriteController.removeFromFavoritesById),
); // DELETE /api/favorites/:favoriteId

router.delete("/", catchAsync(FavoriteController.removeFromFavorite)); // DELETE /api/favorites?userId=123&movieId=238

export default router;
