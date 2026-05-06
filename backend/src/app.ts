import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import {
  authRoutes,
  userRoutes,
  movieRoutes,
  favoriteRoutes,
  watchedRoutes,
  tmdbRoutes,
} from "./routes";

import { errorHandler, notFoundHandler } from "./middlewares";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/watched", watchedRoutes);
app.use("/api/tmdb", tmdbRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
