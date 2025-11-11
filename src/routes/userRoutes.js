import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getPerfil
} from "../controllers/userController.js";
import { verificarToken, esAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Solo los admin pueden ver o crear usuarios
router.get("/", verificarToken, esAdmin, getUsers);
router.get("/:id", verificarToken, esAdmin, getUserById);
router.get("/perfil", verificarToken, getPerfil);
router.post("/", verificarToken, esAdmin, createUser);
router.put("/:id", verificarToken, esAdmin, updateUser);
router.delete("/:id", verificarToken, esAdmin, deleteUser);

export default router;
