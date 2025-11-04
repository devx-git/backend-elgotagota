import express from "express";
import { registrarPago, obtenerPagosPorUsuario } from "../controllers/pagoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registrar nuevo pago
router.post("/", verificarToken, registrarPago);

// Obtener pagos del usuario autenticado
router.get("/mis-pagos", verificarToken, obtenerPagosPorUsuario);

export default router;
