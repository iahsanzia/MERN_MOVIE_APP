import { Router } from "express";
import { FavoriteController } from "../controllers";

const router = Router();

router.post("/", FavoriteController.createFavorite); // POST /api/favorites

router.get("/user/:userId", FavoriteController.getUserFavorites); // GET /api/favorites/user/:userId

router.get("/check", FavoriteController.isFavorite); // GET /api/favorites/check?userId=123&movieId=238

router.get("/count/:movieId", FavoriteController.getFavoriteCount); // GET /api/favorites/count/:movieId

router.get("/user-count/:userId", FavoriteController.getUserFavoriteCount); // GET /api/favorites/user-count/:userId

router.get("/top", FavoriteController.getTopMovies); // GET /api/favorites/top?limit=10

router.get("/all", FavoriteController.getAllfavorites); // GET /api/favorites/all

router.put("/:favoriteId", FavoriteController.updateFavorite); // PUT /api/favorites/:favoriteId

router.delete("/:favoriteId", FavoriteController.removeFromFavoritesById); // DELETE /api/favorites/:favoriteId

router.delete("/", FavoriteController.removeFromFavorite); // DELETE /api/favorites?userId=123&movieId=238

export default router;
