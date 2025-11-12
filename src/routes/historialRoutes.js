import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { obtenerHistorialConGoteo,
  retirarPago,
  invertirPago,
  reinvertirPago } from "../controllers/historialController.js";

const router = express.Router();

router.get("/goteo", verificarToken, obtenerHistorialConGoteo);
router.post("/retirar/:id", verificarToken, retirarPago);
router.post("/invertir/:id", verificarToken, invertirPago);
router.post("/reinvertir/:id", verificarToken, reinvertirPago);


export default router;
