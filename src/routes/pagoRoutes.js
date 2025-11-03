import express from "express";
import { registrarPago } from "../controllers/pagoController.js";
import verificarToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, registrarPago);

export default router;
