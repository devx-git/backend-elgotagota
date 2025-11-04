import Pago from "../models/Pago.js"; // Asegúrate de importar el modelo

export const obtenerPagosPorUsuario = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({ message: "Error al obtener pagos" });
  }
};
