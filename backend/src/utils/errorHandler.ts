import insertLog from "./insertLog.js";
import { UniqueConstraintError, DatabaseError } from "sequelize";

/**
 * Enum for error levels.
 */
export enum errorLevels {
  /** Error level for errors */
  error = "error",
  /** Error level for information */
  info = "info",
  /** Error level for warnings */
  warn = "warn",
}

/**
 * Determines if the error level is "error" or not.
 * @param {string} [level=null] - Error level (e.g., 'INFO', 'ERROR').
 * @returns {boolean|null} True if the level is not "error", null if the level is null.
 */
const levelIsError = (level: string | null): boolean | null => {
  return level ? level.toString().toLowerCase() !== "error" : null;
};

/**
 * Handles errors and logs based on the error level, message, and environment.
 *
 * @async
 * @function errorHandler
 * @param {Object} options - Options object.
 * @param {string} [options.level=null] - Error level (e.g., 'INFO', 'ERROR').
 * @param {string} [options.message=""] - Error message.
 * @param {unknown} [options.error] - (Opcional) Objeto completo del error, usado para procesar errores de Sequelize como UniqueConstraintError o DatabaseError.
 * @param {string} [options.genericId=null] - Generic ID associated with the log.
 * @param {number} [options.userId=null] - User ID that generated the log.
 * @param {boolean} [options.shouldSaveLog=false] - Indicates if the log should be saved regardless of the level.
 * @returns {Promise<{ success: string; message: string }>} Object containing the success status (success) and the error message or original message (message).
 */
export const errorAndLogHandler = async ({
  level = "",
  message = "",
  error, 
  genericId = "",
  userId = 0,
  shouldSaveLog = false,
}: {
  level?: string;
  message?: string;
  error?: unknown;
  genericId?: string;
  userId?: number;
  shouldSaveLog?: boolean;
}): Promise<{ success: string; message: string }> => {

  // Si recibimos un objeto de error, lo procesamos primero
  if (error) {
    if (error instanceof UniqueConstraintError) {
      const parent = (error as any)?.parent;
      message = `${message} Unique constraint violation: ${parent?.sqlMessage || error.message}`;
    } else if (error instanceof DatabaseError) {
      const parent = (error as any)?.parent;
      message = `${message} Database error: ${parent?.sqlMessage || error.message}`;
    } else if (error instanceof Error) {
      message = message+ " " + error.message;
    }
  }

  const messageContainsError = message
    .toString()
    .toLowerCase()
    .includes("error");
  const messageContainsUniqueRestriction = message
    .toString()
    .toLowerCase()
    .includes("unique");
  const messageContainsStock = message
    .toString()
    .toLowerCase()
    .includes("stock");
  const success = messageContainsError ? errorLevels.error : level ?? errorLevels.info;
  // console.log("message: ", message);
  // console.log("unique: ", messageContainsUniqueRestriction);
  if (
    messageContainsError ||
    levelIsError(level) === false ||
    shouldSaveLog !== false
  ) {
    await insertLog(success, message, genericId, userId);
  } else if (process.env.NODE_ENV !== "prod") {
    console.log(
      "message:",
      message,
      "\n",
      "success:",
      success,
      "\n",
      "genericId:",
      genericId,
      "\n",
      "userId:",
      userId,
      "\n"
    );
  } else if (process.env.NODE_ENV === "prod") {
    await insertLog(success, message, genericId, userId);
  }
  return {
    success,
    message: process.env.NODE_ENV === "prod"
      ? messageContainsError
        ? messageContainsUniqueRestriction
          ? "Error: A record with that data already exists"
          : messageContainsStock
          ? "Error: Insufficient stock to complete the operation"
          : "An error occurred at server level, contact support for more information."
        : message
      : message,
  };
};
