import Pago from "../models/Pago.js";
import Plan from "../models/Plan.js";

export const obtenerHistorialConGoteo = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const pagos = await Pago.findAll({
      where: { usuario_id: usuarioId }
    });

    const historial = pagos.map((pago) => {
      // 🧠 Validación de campos
      const planNombre = pago.plan_id ? `Llave ${pago.plan_id}` : "Sin plan";
      const monto = pago.monto;
      const fechaInicio = pago.fecha_pago;

      // 🧠 Validación de monto
      if (!monto) {
        return {
          pago_id: pago.id,
          fecha_inicio: fechaInicio || "Fecha no disponible",
          plan_nombre: planNombre,
          monto: "Inversión no registrada",
          ganancia: "0.00",
          goteo_diario: "0.00",
          dias_transcurridos: 0,
          ganancia_acumulada: "0.00",
          estado: "incompleto",
          acciones: []
        };
      }

      // 🧠 Validación de fecha
      if (!fechaInicio) {
        return {
          pago_id: pago.id,
          fecha_inicio: "Fecha no disponible",
          plan_nombre: planNombre,
          monto,
          ganancia: "0.00",
          goteo_diario: "0.00",
          dias_transcurridos: 0,
          ganancia_acumulada: "0.00",
          estado: "incompleto",
          acciones: []
        };
      }

      // ✅ Cálculo de goteo
      const hoy = new Date();
      const dias = Math.min(30, Math.floor((hoy - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)));

      const ganancia = monto * 0.40;
      const total = monto + ganancia;
      const goteoDiario = total / 30;
      const acumulado = goteoDiario * dias;
      const estado = dias >= 30 ? "completado" : "activo";

      return {
        pago_id: pago.id,
        fecha_inicio: fechaInicio,
        plan_nombre: planNombre,
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
