import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken.js";
import { Usuario } from "../models/index.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";


/**
 * Middleware that checks if the user has the required role.
 * @param roles - List of permitted role IDs.
 * @returns A middleware function that checks if the user has the required role.
 * If the user does not have the required role, it returns a 403 status code with a JSON response containing a warning message.
 * If an error occurs while verifying the token, it returns a 500 status code with a JSON response containing an error message.
 */
export const checkRole =
  (roles: number[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.signedCookies.authToken;

      if (!token) {
        return res.status(401).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: "Missing token",
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

      const user = await Usuario.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: "User not found",
          })
        );
      }

      if (!roles.includes(user.rolId)) {
        return res.status(403).json(
          await errorAndLogHandler({
            level: errorLevels.warn,
            message: "Insufficient role permissions",
          })
        );
      }

      req.user = decoded;
      next();
    } catch (error: any) {
      return res.status(500).json(
        await errorAndLogHandler({
          level: errorLevels.error,
          message: "Role check failed: " + error.message,
        })
      );
    }
  };
