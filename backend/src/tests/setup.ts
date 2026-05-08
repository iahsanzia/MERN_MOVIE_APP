import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import path from "node:path";
import { beforeAll, afterAll, afterEach } from "@jest/globals";
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
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection?.deleteMany({});
  }
});
