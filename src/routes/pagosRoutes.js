import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { obtenerPagos } from "../controllers/pagosController.js";

const router = express.Router();

router.get("/", verificarToken, obtenerPagos);

export default router;
