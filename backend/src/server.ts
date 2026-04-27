import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { getEnvironmentVariables } from "./config/environment";
import dotenv from "dotenv";

dotenv.config();

const env = getEnvironmentVariables();

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  }),
);
app.use(express.json());

connectDB();

app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

export default app;
