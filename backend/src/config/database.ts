import mongoose from "mongoose";
import dns from "node:dns";
import { getEnvironmentVariables } from "./environment";

const env = getEnvironmentVariables();

export const connectDB = async (): Promise<void> => {
  try {
    if (env.DNS_SERVERS.length > 0) {
      dns.setServers(env.DNS_SERVERS);
      console.log(`Using custom DNS servers: ${env.DNS_SERVERS.join(", ")}`);
    }

    const mongoUri = env.USE_LOCAL_DB ? env.MONGODB_LOCAL_URI : env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }
    const dbType = env.USE_LOCAL_DB ? "Local MongoDB" : "MongoDB Atlas";
    console.log(`Connecting to ${dbType}...`);
    await mongoose.connect(mongoUri);
    console.log(` ${dbType} connected successfully`);
  } catch (error) {
    const dbType = env.USE_LOCAL_DB ? "Local MongoDB" : "MongoDB Atlas";

    console.error(`Error connecting to  ${dbType}:`);
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:");
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
  }
};
