import initDb from "./logDBconfig.js";

/**
 * Inserts a log into the database.
 *
 * @param {string} level - Log level (e.g., 'INFO', 'ERROR').
 * @param {string} message - Log message.
 * @param {string} genericId - Generic ID associated with the log.
 * @param {number} userId - User ID that generated the log.
 */
const insertLog = async (level: string, message: string, genericId: string, userId: number): Promise<void> => {
  try {
    const db = await initDb();
    await db.run(
      "INSERT INTO logs (level, message, generic_id, user_id) VALUES (?, ?, ?, ?)",
      level,
      message,
      genericId,
      userId
    );
    console.log("Log inserted");
  } catch (error:Error | any) {
    console.error("Error inserting log:", error.message);
  }
};

export default insertLog;
