import Retiro from "../models/Retiro.js";
import Pago from "../models/Pago.js";

export const registrarRetiro = async (req, res) => {
  try {
    const { pago_id, titular, tipo_cuenta, numero_cuenta, monto } = req.body;
    const user_id = req.user.id;

    // Verificar que el pago exista y pertenezca al usuario
    const pago = await Pago.findOne({
      where: {
        id: pago_id,
        user_id
      }
    });

    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado o no autorizado" });
    }

    // Verificar que el estado sea 'completado'
    if (pago.estado !== "completado") {
      return res.status(400).json({ message: "Solo puedes retirar pagos completados" });
    }

    // Crear el retiro
    const retiro = await Retiro.create({
      user_id,
      pago_id,
      titular,
      tipo_cuenta,
      numero_cuenta,
      monto
    });

    // Actualizar el estado del pago a 'retirado'
    pago.estado = "retirado";
    await pago.save();

    res.json({
      message: "Retiro registrado y pago marcado como retirado",
      retiro
    });
  } catch (error) {
    console.error("❌ Error al registrar retiro:", error);
    res.status(500).json({ message: "Error al registrar retiro" });
  }
};
