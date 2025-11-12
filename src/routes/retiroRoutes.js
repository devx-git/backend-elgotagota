import express from "express";
import { registrarRetiro } from "../controllers/retiroController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, registrarRetiro);

export default router;
