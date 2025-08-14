import jwt from "jsonwebtoken";

// Interface for the payload that's going to be signed
export interface UserTokenPayload {
  id: number;
  email: string;
  name: string;
  rolId: number;
}

/**
 * Generates a JWT for the user.
 * @param user - Minimal user data.
 * @returns Signed token.
 */
const tokenSign = async (user: UserTokenPayload): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(user, secret, { expiresIn: "1d" });
};

/**
 * Verifies a JWT token.
 * @param token - JWT token.
 * @returns Decoded payload if valid, or null if it fails.
 */
const verifyToken = async (
  token: string
): Promise<UserTokenPayload | null> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  try {
    return jwt.verify(token, secret) as UserTokenPayload;
  } catch (error) {
    return null;
  }
};

export { tokenSign, verifyToken };
