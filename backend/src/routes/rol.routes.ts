import express from "express";
import { RolController } from "../controllers/rol.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/rol",
            checkAuth, 
            RolController.create);
router.get("/rol/:id", 
            checkAuth, 
            RolController.getByID);
router.get("/rol", checkAuth, RolController.getAll);
router.put("/rol/:id", 
            checkAuth, 
            RolController.update);
router.patch("/rol/:id", 
            checkAuth, 
            RolController.partialUpdate);


export default router;
