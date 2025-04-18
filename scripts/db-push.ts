import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { neon, neonConfig } from "@neondatabase/serverless";

// This script is used to push schema changes to the database
async function main() {
  console.log("🚀 Starting database migration...");
  
  try {
    // Create a database connection
    neonConfig.fetchConnectionCache = true;
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);
    
    // Run the migrations
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();