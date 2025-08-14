import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import path from "path";

// Database configuration
const initDb = async (): Promise<Database> => {
  const dbPath = path.resolve("src", "db", "logs.db");
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  console.log("Database location:", dbPath);
  // Create the logs table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      generic_id TEXT,
      user_id INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
};

export default initDb;
