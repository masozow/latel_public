import express from "express";
import { EstadoController } from "../controllers/estado.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/estado",
            checkAuth, 
            EstadoController.create);
router.get("/estado/:id", 
            checkAuth, 
            EstadoController.getByID);
router.get("/estado", checkAuth, EstadoController.getAll);
router.put("/estado/:id", 
            checkAuth, 
            EstadoController.update);
router.patch("/estado/:id", 
            checkAuth, 
            EstadoController.partialUpdate);

export default router;
