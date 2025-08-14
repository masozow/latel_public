import express from "express";
import {  BodegaController } from "../controllers/bodega.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/bodega",
            checkAuth, 
            BodegaController.create);
router.get("/bodega/:id", 
            checkAuth, 
            BodegaController.getByID);
router.get("/bodega", 
            checkAuth, 
            BodegaController.getAll);
router.put("/bodega/:id",
            checkAuth, 
            BodegaController.update);
router.patch("/bodega/:id", 
            checkAuth, 
            BodegaController.partialUpdate);

export default router;
