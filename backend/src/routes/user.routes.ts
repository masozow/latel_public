import express from "express";
import { UserController } from "../controllers/usuario.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/user", UserController.create);
router.get(`/user/:id`, checkAuth, UserController.getByID);
router.get("/user", checkAuth, UserController.getAll);
router.put("/user/:id", checkAuth, UserController.update);
router.patch("/user/:id", checkAuth, UserController.partialUpdate);

export default router;
