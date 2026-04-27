export interface EnvironmentVariables {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  MONGODB_URI: string;
  MONGODB_LOCAL_URI: string;
  DNS_SERVERS: string[];
  JWT_SECRET: string;
  USE_LOCAL_DB: boolean;
  JWT_EXPIRES_IN: string;
  TMDB_API_KEY: string;
  TMDB_BASE_URL: string;
  FRONTEND_URL: string;
}

export const getEnvironmentVariables = (): EnvironmentVariables => {
  return {
    NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
    PORT: parseInt(process.env.PORT || "5000", 10),
    MONGODB_URI:
      process.env.MONGODB_URI || "mongodb://localhost:27017/movie-app",
    MONGODB_LOCAL_URI:
      process.env.MONGODB_LOCAL_URI || "mongodb://localhost:27017/movie-app",
    DNS_SERVERS: (process.env.DNS_SERVERS || "")
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean),
    USE_LOCAL_DB: process.env.USE_LOCAL_DB === "true",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "10d",
    TMDB_API_KEY: process.env.TMDB_API_KEY || "",
    TMDB_BASE_URL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  };
};
