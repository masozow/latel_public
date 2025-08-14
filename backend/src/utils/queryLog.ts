import initDb from "./logDBconfig.js";

/**
 * Retrieves logs from the database.
 *
 * @param {string} [level] - Filter logs by level (optional).
 * @param {number} [userId] - Filter logs by user ID (optional).
 * @returns {Promise<Array>} List of logs.
 */
const queryLog = async (level?: string, userId?: number): Promise<Array<any>> => {
  try {
    const db = await initDb();
    let logs;

    if (level && userId) {
      logs = await db.all(
          "SELECT * FROM logs WHERE level = ? AND user_id = ? ORDER BY timestamp DESC",
          level,
          userId
      );
    } else if (level) {
      logs = await db.all(
          "SELECT * FROM logs WHERE level = ? ORDER BY timestamp DESC",
          level
      );
    } else if (userId) {
      logs = await db.all(
          "SELECT * FROM logs WHERE user_id = ? ORDER BY timestamp DESC",
          userId
      );
    } else {
      logs = await db.all("SELECT * FROM logs ORDER BY timestamp DESC");
    }

    return logs;
  } catch (error: Error | any) {
    console.error("Error when retrieving logs:", error.message);
    return [];
  }
};

export default queryLog;
