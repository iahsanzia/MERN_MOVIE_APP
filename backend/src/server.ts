import app from "./app";
import { connectDB } from "./config/database";
import { getEnvironmentVariables } from "./config/environment";

// console.log("SEVER REACHED1");

const env = getEnvironmentVariables();

// console.log("SEVER REACHED2");

connectDB();

// Only listen on port when not running as a Vercel serverless function
// Vercel serverless functions are handled by the api/index.ts export
if (process.env.VERCEL_ENV === undefined) {
  app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
}
