import Pago from "../models/Pago.js";
import Plan from "../models/Plan.js";

export const obtenerHistorialConGoteo = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const pagos = await Pago.findAll({
      where: { usuario_id: usuarioId },
      include: [{ model: Plan }]
    });

    const historial = pagos.map((pago) => {
      const fechaInicio = new Date(pago.fecha_pago);
      const hoy = new Date();
      const dias = Math.min(30, Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24)));

      const monto = pago.monto;
      const ganancia = monto * 0.40;
      const total = monto + ganancia;
      const goteoDiario = total / 30;
      const acumulado = goteoDiario * dias;

      const estado = dias >= 30 ? "completado" : "activo";

      return {
        pago_id: pago.id,
        fecha_inicio: pago.fecha_pago,
        plan_nombre: `Llave ${pago.Plan.numero}`,
        monto,
        ganancia: ganancia.toFixed(2),
        goteo_diario: goteoDiario.toFixed(2),
        dias_transcurridos: dias,
        ganancia_acumulada: acumulado.toFixed(2),
        estado,
        acciones: estado === "completado" ? ["Retirar", "Invertir", "Reinvertir"] : []
      };
    });

    res.json(historial);
  } catch (error) {
    console.error("❌ Error al obtener historial con goteo:", error);
    res.status(500).json({ message: "Error al obtener historial con goteo" });
  }
};
