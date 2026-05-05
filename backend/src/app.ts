import express from "express";
import cors from "cors";
import {
  authRoutes,
  userRoutes,
  movieRoutes,
  favoriteRoutes,
  watchedRoutes,
} from "./routes";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./middlewares";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/watched", watchedRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
