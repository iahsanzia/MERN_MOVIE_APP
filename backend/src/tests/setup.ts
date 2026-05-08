import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import path from "node:path";
import { beforeAll, afterAll } from "@jest/globals";
import { getEnvironmentVariables } from "../config/environment";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

beforeAll(async () => {
  const env = getEnvironmentVariables();

  if (env.DNS_SERVERS.length > 0) {
    dns.setServers(env.DNS_SERVERS);
    console.log(`Using custom DNS servers: ${env.DNS_SERVERS.join(", ")}`);
  }

  const mongoUri = env.USE_LOCAL_DB ? env.MONGODB_LOCAL_URI : env.MONGODB_URI;
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 60000,
  });
  console.log("MongoDB connected successfully");

  // Clear database ONCE before all tests start
  await clearAllCollections();
});

afterAll(async () => {
  // Optional: Clear after all tests complete
  await clearAllCollections();
  await mongoose.disconnect();
});

async function clearAllCollections() {
  try {
    const db = mongoose.connection.getClient().db(mongoose.connection.name);

    // Get all collections
    const collections = await db.listCollections().toArray();

    // Drop each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      // Skip system collections
      if (!collectionName.startsWith("system.")) {
        try {
          await db.dropCollection(collectionName);
          console.log(
            `[Startup Cleanup] Dropped collection: ${collectionName}`,
          );
        } catch (error: any) {
          // Collection might not exist, that's okay
          if (error.code !== 26) {
            console.error(
              `Error dropping collection ${collectionName}:`,
              error,
            );
          }
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error("Error in database cleanup:", error);
    throw error;
  }
}
