import { Router } from "express";
import { WatchedController } from "../controllers";

const router = Router();

router.post("/", WatchedController.addToWatched); // POST /api/watched
router.get("/user/:userId", WatchedController.getWatchedByUserID); // GET /api/watched/user/:userId
router.get("/check", WatchedController.isWatched); // GET /api/watched/check?userId=123&movieId=238
router.get("/recent/:userId", WatchedController.getUserRecentlyWatchedMovies); // GET /api/watched/recent/:userId?limit=10
router.get("/top", WatchedController.getTopWatchedMovies); // GET /api/watched/top?limit=10
router.get("/count/:movieId", WatchedController.getWatchedCount); // GET /api/watched/count/:movieId
router.get("/user-count/:userId", WatchedController.getUserWatchedCount); // GET /api/watched/user-count/:userId
router.get("/sorted/:userId", WatchedController.getUserWatchedMovieSorted); // GET /api/watched/sorted/:userId?order=desc
router.get("/stats/:userId", WatchedController.getUserWatchedStats); // GET /api/watched/stats/:userId
router.get("/all", WatchedController.getAllWatched); // GET /api/watched/all
router.put("/:watchedId", WatchedController.updateWatched); // PUT /api/watched/:watchedId
router.delete("/:watchedId", WatchedController.removedFromWatchedById); // DELETE /api/watched/:watchedId
router.delete("/", WatchedController.removedFromWatched); // DELETE /api/watched?userId=123&&movieId=238

export default router;
