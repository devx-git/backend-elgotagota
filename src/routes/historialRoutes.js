import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { obtenerHistorial } from "../controllers/historialController.js";

const router = express.Router();

router.get("/", verificarToken, obtenerHistorial);

export default router;
