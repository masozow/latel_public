import bcrypt from "bcrypt";

/**
 * Generates a password hash using bcrypt.
 * @param password - Plain text password.
 * @returns Generated hash.
 */
export const hashedPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  if (!saltRounds) throw new Error("Missing BCRYPT_SALT_ROUNDS");

  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a stored hash.
 * @param password - Input password.
 * @param hash - Stored hash.
 * @returns Boolean indicating if they match.
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Password comparison failed:", error);
    throw error;
  }
};

