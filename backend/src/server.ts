import app from "./app";
import { connectDB } from "./config/database";
import { getEnvironmentVariables } from "./config/environment";

const env = getEnvironmentVariables();

connectDB();

app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
