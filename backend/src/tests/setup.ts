import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import path from "node:path";
import { beforeAll, afterAll } from "@jest/globals";
import { getEnvironmentVariables } from "../config/environment";
import { User, Movie } from "../models";

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

  // Create indexes after connection
  await createIndexes();
});

afterAll(async () => {
  // Optional: Clear after all tests complete
  await clearAllCollections();
  await mongoose.disconnect();
});

async function createIndexes() {
  try {
    // Create unique indexes for User
    await User.collection.createIndex(
      { email: 1 },
      { unique: true, sparse: false },
    );
    await User.collection.createIndex(
      { username: 1 },
      { unique: true, sparse: false },
    );

    // Create index for Movie movieId
    await Movie.collection.createIndex(
      { movieId: 1 },
      { unique: true, sparse: false },
    );
  } catch (error) {
    console.log(
      "Index creation note:",
      error instanceof Error ? error.message : error,
    );
  }
}

async function clearAllCollections() {
  try {
    const db = mongoose.connection.getClient().db(mongoose.connection.name);

    // Get all collections
    const collections = await db.listCollections().toArray();

    // Delete documents from each collection (don't drop, which would remove indexes)
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      // Skip system collections
      if (!collectionName.startsWith("system.")) {
        try {
          const collection = db.collection(collectionName);
          await collection.deleteMany({});
          console.log(`[Cleanup] Cleared collection: ${collectionName}`);
        } catch (error: any) {
          console.error(`Error clearing collection ${collectionName}:`, error);
        }
      }
    }

    // Don't recreate indexes - they're preserved by deleteMany
    // Mongoose enforces unique constraints from schema definitions
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error("Error in database cleanup:", error);
  }
}
