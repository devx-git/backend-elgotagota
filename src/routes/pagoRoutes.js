import express from "express";
import { registrarPago, obtenerPagosPorUsuario } from "../controllers/pagoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { actualizarEstadoPago } from "../controllers/pagoController.js";
import { obtenerTodosLosPagos } from "../controllers/pagoController.js";

const router = express.Router();

// Registrar nuevo pago
router.post("/", verificarToken, registrarPago);

// Obtener pagos del usuario autenticado
router.get("/mis-pagos", verificarToken, obtenerPagosPorUsuario);

router.put("/estado/:id", verificarToken, actualizarEstadoPago); // ✅ PUT /api/pagos/estado/:id

router.get("/admin", verificarToken, obtenerTodosLosPagos);


export default router;
