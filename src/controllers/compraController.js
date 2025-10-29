// controllers/compraController.js
import Compra from "../models/Compra.js";
import Plan from "../models/Plan.js";
import User from "../models/User.js";

/**
 * Crear una compra (solo clientes)
 */
export const crearCompra = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.usuario.id;

    // Verificar si el plan existe
    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json({ message: "El plan no existe" });
    }

    // Crear compra
    const compra = await Compra.create({
      userId,
      planId,
      valorPagado: plan.precio,
      estado: "pendiente",
    });

    res.status(201).json({
      message: "Compra registrada correctamente",
      compra,
    });
  } catch (error) {
    console.error("Error al crear compra:", error);
    res.status(500).json({ message: "Error al registrar la compra" });
  }
};

/**
 * Obtener todas las compras (solo admin)
 */
export const obtenerCompras = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        { model: User, as: "usuario", attributes: ["id", "nombre", "correo", "rol"] },
        { model: Plan, as: "plan", attributes: ["id", "nombre", "precio"] },
      ],
      order: [["fechaCompra", "DESC"]],
    });

    res.json(compras);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    res.status(500).json({ message: "Error al obtener las compras" });
  }
};

/**
 * Obtener compras del usuario autenticado (cliente)
 */
export const obtenerMisCompras = async (req, res) => {
  try {
    const userId = req.usuario.id;
    const compras = await Compra.findAll({
      where: { userId },
      include: [{ model: Plan, as: "plan", attributes: ["id", "nombre", "precio"] }],
      order: [["fechaCompra", "DESC"]],
    });

    res.json(compras);
  } catch (error) {
    console.error("Error al obtener tus compras:", error);
    res.status(500).json({ message: "Error al obtener tus compras" });
  }
};

/**
 * Actualizar estado de una compra (solo admin)
 */
export const actualizarEstadoCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!["pendiente", "pagado", "cancelado"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const compra = await Compra.findByPk(id);
    if (!compra) return res.status(404).json({ message: "Compra no encontrada" });

    compra.estado = estado;
    await compra.save();

    res.json({ message: "Estado actualizado correctamente", compra });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ message: "Error al actualizar el estado de la compra" });
  }
};
