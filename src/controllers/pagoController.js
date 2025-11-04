import Pago from "../models/Pago.js";

export const registrarPago = async (req, res) => {
  try {
    const { metodo, nombre, celular, referencia } = req.body;
    const user_id = req.user.id;

    const nuevoPago = await Pago.create({
      user_id,
      metodo,
      referencia,
      nombre,
      celular,
      estado: "pendiente",
    });

    res.json({ message: "✅ Pago registrado", pago: nuevoPago });
  } catch (error) {
    console.error("❌ Error al registrar pago:", error);
    res.status(500).json({ message: "Error al registrar el pago" });
  }
};

