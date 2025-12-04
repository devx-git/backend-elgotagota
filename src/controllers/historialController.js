import Pago from "../models/Pago.js";
import Plan from "../models/Plan.js";

export const obtenerHistorialConGoteo = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const pagos = await Pago.findAll({ where: { user_id: usuarioId } });
    console.log("📦 Pagos encontrados:", pagos.map(p => p.toJSON())); // 👈 aquí
    const hoy = new Date();

    const historial = await Promise.all(pagos.map(async (pago) => {
      console.log("➡️ Pago procesado:", pago.toJSON()); // 👈 aquí
      const planNombre = pago.plan_id ? `Llave ${pago.plan_id}` : (pago.plan_nombre || "Sin plan");
      const monto = pago.monto;
      const fechaInicio = pago.fecha_pago || pago.fecha_inicio; // soporta ambos campos

      if (!monto || !fechaInicio) {
        return {
          pago_id: pago.id,
          fecha_inicio: fechaInicio || "Fecha no disponible",
          plan_nombre: planNombre,
          monto: monto || "Inversión no registrada",
          ganancia: "0.00",
          goteo_diario: "0.00",
          dias_transcurridos: 0,
          ganancia_acumulada: "0.00",
          estado: "incompleto",
          acciones: []
        };
      }

      // ✅ Cálculo de goteo (igual para planes normales y personalizados)
      const dias = Math.min(30, Math.floor((hoy - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)));
      const ganancia = monto * 0.40;
      const total = monto + ganancia;
      const goteoDiario = total / 30;
      const acumulado = goteoDiario * dias;
      const estado = dias >= 30 ? "completado" : "activo";

       // ✅ Guardar acumulado y estado en la BD cuando se completa
      if (estado === "completado" && pago.estado !== "completado") {
        pago.estado = "completado";
        pago.ganancia_acumulada = parseFloat(acumulado.toFixed(2));
        console.log("💾 Guardando pago:", pago.toJSON()); // 👈 aquí
        await pago.save();
      }
        
       // ✅ Acciones según tipo de plan
      let acciones = [];
      if (estado === "completado") {
        acciones = ["Retirar"];
        if (pago.plan_nombre === "invertir" || pago.plan_nombre === "reinvertir") {
          acciones.push("Reinvertir"); // ya es inversión personalizada
        } else {
          acciones.push("Invertir", "Reinvertir"); // planes normales
        }
      }
     
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
    }));

    res.json(historial);
  } catch (error) {
    console.error("❌ Error al obtener historial con goteo:", error);
    res.status(500).json({ message: "Error al obtener historial con goteo" });
  }
};

export const retirarPago = async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id);
    if (!pago) return res.status(404).json({ message: "Pago no encontrado" });

    pago.estado = "retirado";
    await pago.save();

    res.json({ message: "Pago retirado correctamente" });
  } catch (error) {
    console.error("❌ Error al retirar pago:", error);
    res.status(500).json({ message: "Error al retirar pago" });
  }
};

export const invertirPago = async (req, res) => {
  try {
    const pagoOriginal = await Pago.findByPk(req.params.id);
    if (!pagoOriginal) return res.status(404).json({ message: "Pago no encontrado" });

    if (pagoOriginal.estado !== "completado") {
      return res.status(400).json({ message: "Solo puedes invertir pagos completados" });
    }

    const inversionInicial = Number(pagoOriginal.ganancia_acumulada || pagoOriginal.monto || 0);
    if (!inversionInicial || inversionInicial <= 0) {
      return res.status(400).json({ message: "No hay ganancia para invertir" });
    }

    const DIAS = 30;
    const utilidadMensual = Math.floor(inversionInicial * 0.40);
    const totalGoteo = inversionInicial + utilidadMensual;
    const goteoDiario = Math.floor(totalGoteo / DIAS);

    // Reiniciar fechas
    const ahora = new Date();
    const fechaFin = new Date(ahora.getTime() + DIAS * 24 * 60 * 60 * 1000);

    const nuevoPago = await Pago.create({
      user_id: req.user.id,
      plan_id: null,
      plan_nombre: "invertir",
      monto: inversionInicial,
      ganancia_acumulada: 0,
      estado: "activo",
      fecha_inicio: ahora,
      fecha_fin: fechaFin,
      // 👇 Copiamos campos obligatorios del pago original
      metodo: pagoOriginal.metodo,
      referencia: pagoOriginal.referencia,
      nombre: pagoOriginal.nombre,
      celular: pagoOriginal.celular
    });

    res.json({
      message: `Inversión creada por 30 días. Goteo diario: ${goteoDiario}`,
      nuevoPago
    });
  } catch (error) {
    console.error("❌ Error al invertir:", error.message, error.stack);
    res.status(500).json({ message: "Error al invertir" });
  }
};


export const reinvertirPago = async (req, res) => {
  try {
    const pagoOriginal = await Pago.findByPk(req.params.id);
    if (!pagoOriginal) return res.status(404).json({ message: "Pago no encontrado" });

    if (pagoOriginal.estado !== "completado") {
      return res.status(400).json({ message: "Solo puedes reinvertir pagos completados" });
    }

    const inversionInicial = Number(pagoOriginal.ganancia_acumulada || pagoOriginal.monto || 0);
    if (!inversionInicial || inversionInicial <= 0) {
      return res.status(400).json({ message: "No hay ganancia para reinvertir" });
    }

    const DIAS = 30;
    const utilidadMensual = Math.floor(inversionInicial * 0.40);
    const totalGoteo = inversionInicial + utilidadMensual;
    const goteoDiario = Math.floor(totalGoteo / DIAS);

    // Reiniciar fechas
    const ahora = new Date();
    const fechaFin = new Date(ahora.getTime() + DIAS * 24 * 60 * 60 * 1000);

    const nuevoPago = await Pago.create({
      user_id: req.user.id,
      plan_id: null,
      plan_nombre: "reinvertir",
      monto: inversionInicial,
      ganancia_acumulada: 0,
      estado: "activo",
      fecha_inicio: ahora,
      fecha_fin: fechaFin,
      // 👇 Copiamos campos obligatorios del pago original
      metodo: pagoOriginal.metodo,
      referencia: pagoOriginal.referencia,
      nombre: pagoOriginal.nombre,
      celular: pagoOriginal.celular
    });

    res.json({
      message: `Reinversión creada por 30 días. Goteo diario: ${goteoDiario}`,
      nuevoPago
    });
  } catch (error) {
    console.error("❌ Error al reinvertir:", error.message, error.stack);
    res.status(500).json({ message: "Error al reinvertir" });
  }
};


