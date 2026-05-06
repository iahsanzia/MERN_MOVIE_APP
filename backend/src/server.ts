import app from "./app";
import { connectDB } from "./config/database";
import { getEnvironmentVariables } from "./config/environment";

// console.log("SEVER REACHED1");

const env = getEnvironmentVariables();

// console.log("SEVER REACHED2");

connectDB();

app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
