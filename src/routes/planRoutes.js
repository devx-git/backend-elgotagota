import express from "express";
import {
  getPlanes,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";
import { verificarToken, esAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPlanes);
router.get("/:id", verificarToken, getPlanById);
router.post("/", verificarToken, esAdmin, createPlan);
router.put("/:id", verificarToken, esAdmin, updatePlan);
router.delete("/:id", verificarToken, esAdmin, deletePlan);

export default router;
