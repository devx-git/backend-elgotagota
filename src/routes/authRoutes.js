import express from "express";
import { register, login, verificar } from "../controllers/authController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verificar", verificarToken, verificar);

export default router;
