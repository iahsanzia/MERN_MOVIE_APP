import "dotenv/config";
import { connectDB, disconnectDB } from "./database";

console.log(" Testing database.ts...\n");

const testDatabaseConnection = async () => {
  try {
    await connectDB();

    console.log("\n✅ database.ts is working correctly!");

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
};

testDatabaseConnection();
