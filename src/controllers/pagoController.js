import Pago from "../models/Pago.js";

export const registrarPago = async (req, res) => {
  try {
    const { nivel, inversion, metodo, referencia, nombre, celular } = req.body;
    const user_id = req.usuario.id;

    const nuevoPago = await Pago.create({
      user_id,
      plan_id: nivel,
      plan_nombre: `Llave ${nivel}`,
      metodo,
      referencia,
      nombre,
      celular,
      monto: inversion,
      estado: "pendiente",
    });

    res.json({ message: "✅ Pago registrado", pago: nuevoPago });
  } catch (error) {
    console.error("❌ Error al registrar pago:", error);
    res.status(500).json({ message: "Error al registrar el pago" });
  }
};

