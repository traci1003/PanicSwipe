import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

// Create a database connection
neonConfig.fetchConnectionCache = true;
const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
export const db = drizzle(sql);