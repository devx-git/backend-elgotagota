import express from "express";
import {
  crearCompra,
  obtenerCompras,
  obtenerMisCompras,
  actualizarEstadoCompra,
} from "../controllers/compraController.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { verificarRol } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 👤 Cliente compra un plan
router.post("/", verificarToken, verificarRol(["cliente", "admin"]), crearCompra);

// 👤 Cliente consulta sus compras
router.get("/mis-compras", verificarToken, verificarRol(["cliente", "admin"]), obtenerMisCompras);

// 👑 Admin consulta todas las compras
router.get("/", verificarToken, verificarRol(["admin"]), obtenerCompras);

// 👑 Admin actualiza estado de compra
router.put("/:id", verificarToken, verificarRol(["admin"]), actualizarEstadoCompra);

export default router;
