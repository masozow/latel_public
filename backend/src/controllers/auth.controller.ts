import { Request, Response } from "express";
import { Usuario, Entidad } from "../models/index.js";
import { comparePassword } from "../utils/encryption.js";
import { tokenSign } from "../utils/generateToken.js";
import { errorAndLogHandler, errorLevels } from "../utils/errorHandler.js";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({
      include: [
        {
          model: Entidad,
          as: "entidad",
          where: { email, estadoId: 1 },
          required: true,
        },
      ],
    });

    if (!user || typeof user.password !== "string") {
      return res.status(404).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "User not found",
        })
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "Incorrect password",
        })
      );
    }

    const token = await tokenSign({
      id: user.id,
      email: user.entidad?.email,
      name: user.entidad?.nombre,
      rolId: user.rolId,
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: `Welcome ${user.entidad?.nombre}`,
        userId: user.id,
        shouldSaveLog: true,
      })
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Login failed: " + error.message,
      })
    );
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const token = req.signedCookies.authToken;

    if (!token) {
      return res.status(400).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "No active session",
        })
      );
    }

    res.clearCookie("authToken", {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
    });

    return res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: "Successfully logged out",
      })
    );
  } catch (error: any) {
    return res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Logout error: " + error.message,
        userId: 0,
      })
    );
  }
};

const session = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json(
        await errorAndLogHandler({
          level: errorLevels.warn,
          message: "User not authenticated",
        })
      );
    }

    return res.status(200).json(
      await errorAndLogHandler({
        level: errorLevels.info,
        message: JSON.stringify(user),
        userId: 0,
        shouldSaveLog: true,
      })
    );
  } catch (error: any) {
    return res.status(500).json(
      await errorAndLogHandler({
        level: errorLevels.error,
        message: "Session check failed: " + error.message,
      })
    );
  }
};

export const AuthController = {
  login,
  logout,
  session,
};
