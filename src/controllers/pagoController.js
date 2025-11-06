import Pago from "../models/Pago.js"; // Modelo Sequelize
import Plan from "../models/Plan.js";
// ✅ Registrar nuevo pago

   export const registrarPago = async (req, res) => {
    try {
      const nuevoPago = await Pago.create({
        user_id: req.user.id,
        plan_id: req.body.plan_id,
        metodo: req.body.metodo,
        referencia: req.body.referencia,
        nombre: req.body.nombre,
        celular: req.body.celular,
        estado: "activo", // ✅ activación directa
        fecha_pago: new Date(), // ✅ marca la fecha de activación
      });

    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error("Error al registrar el pago:", error);
    res.status(500).json({ message: "Error al registrar el pago" });
  }
};

// ✅ Obtener pagos del usuario autenticado
export const obtenerPagosPorUsuario = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Plan,
          as: "plan",
          attributes: ["id", "nombre", "inversion_inicial", "utilidad_mensual"],
        },
      ],
    });

    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({ message: "Error al obtener pagos" });
  }
};
