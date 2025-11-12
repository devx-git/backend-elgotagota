import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { obtenerHistorialConGoteo } from "../controllers/historialController.js";

const router = express.Router();

router.get("/goteo", verificarToken, obtenerHistorialConGoteo);

export default router;
