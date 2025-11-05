import Compra from "../models/Compra.js";

export const obtenerHistorial = async (req, res) => {
  try {
    const historial = await Compra.findAll({
      where: {
        user_id: req.user.id,
        estado: "finalizado", // ✅ solo planes cerrados
      },
      order: [["updatedAt", "DESC"]],
    });

    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ message: "Error al obtener historial" });
  }
};
