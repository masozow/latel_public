import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";


/**
 * Middleware that checks if the user is logged in and if the JWT token is valid.
 * If the token is invalid, it returns a 401 status code with a JSON response containing a warning message.
 * If the token is valid, it appends the user data to the request and calls the next middleware.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware.
 *
 * @throws {Error} If the JWT token verification fails, an error is thrown with a 403 status code.
 */
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies.authToken;

    if (!token) {
      return res.status(401).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "User not logged in",
        })
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Invalid token",
        })
      );
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(403).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Token verification error: " + error.message,
      })
    );
  }
};
