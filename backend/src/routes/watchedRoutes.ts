import { Router } from "express";
import { WatchedController } from "../controllers";
import { catchAsync } from "../utils";

const router = Router();

router.post("/", catchAsync(WatchedController.addToWatched)); // POST /api/watched
router.get("/user/:userId", catchAsync(WatchedController.getWatchedByUserID)); // GET /api/watched/user/:userId
router.get("/check", catchAsync(WatchedController.isWatched)); // GET /api/watched/check?userId=123&movieId=238
router.get(
  "/recent/:userId",
  catchAsync(WatchedController.getUserRecentlyWatchedMovies),
); // GET /api/watched/recent/:userId?limit=10
router.get("/top", catchAsync(WatchedController.getTopWatchedMovies)); // GET /api/watched/top?limit=10
router.get("/count/:movieId", catchAsync(WatchedController.getWatchedCount)); // GET /api/watched/count/:movieId
router.get(
  "/user-count/:userId",
  catchAsync(WatchedController.getUserWatchedCount),
); // GET /api/watched/user-count/:userId
router.get(
  "/sorted/:userId",
  catchAsync(WatchedController.getUserWatchedMovieSorted),
); // GET /api/watched/sorted/:userId?order=desc
router.get("/stats/:userId", catchAsync(WatchedController.getUserWatchedStats)); // GET /api/watched/stats/:userId
router.get("/all", catchAsync(WatchedController.getAllWatched)); // GET /api/watched/all
router.put("/:watchedId", catchAsync(WatchedController.updateWatched)); // PUT /api/watched/:watchedId
router.delete(
  "/:watchedId",
  catchAsync(WatchedController.removedFromWatchedById),
); // DELETE /api/watched/:watchedId
router.delete("/", catchAsync(WatchedController.removedFromWatched)); // DELETE /api/watched?userId=123&&movieId=238

export default router;
