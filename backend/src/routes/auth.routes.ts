import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/index.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/logout", checkAuth, AuthController.logout);
router.get("/session", checkAuth, AuthController.session);

export default router;