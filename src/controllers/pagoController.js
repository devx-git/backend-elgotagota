import Pago from "../models/Pago.js"; // Modelo Sequelize
import Plan from "../models/Plan.js";
import User from "../models/User.js"; // asegúrate de importar el modelo
// ✅ Registrar nuevo pago

   export const registrarPago = async (req, res) => {
    try {
      console.log("📥 Datos recibidos:", req.body);
      console.log("👤 Usuario autenticado:", req.user);

            // ✅ Buscar el plan en la base de datos
          const plan = await Plan.findByPk(req.body.plan_id);
          if (!plan) {
            return res.status(404).json({ message: "Plan no encontrado" });
          }
      const nuevoPago = await Pago.create({
        user_id: req.user.id,
        plan_id: plan.id,
        metodo: req.body.metodo,
        referencia: req.body.referencia,
        nombre: req.body.nombre,
        celular: req.body.celular,
        monto: plan.inversion_inicial, // ✅ valor real desde la tabla plan
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

export const actualizarEstadoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    pago.estado = estado;
    await pago.save();

    res.json({ message: "Estado actualizado correctamente", pago });
  } catch (error) {
    console.error("Error al actualizar estado del pago:", error);
    res.status(500).json({ message: "Error al actualizar estado del pago" });
  }
};

export const obtenerTodosLosPagos = async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const pagos = await Pago.findAll({
      include: [
        {
          model: Plan,
          as: "plan",
          attributes: ["id", "nombre", "inversion_inicial", "utilidad_mensual"],
        },
        {
          model: User,
          as: "usuario",
          attributes: ["id", "nombre", "correo"], // ajusta según tus campos
        },
      ],
    });

    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener todos los pagos:", error);
    res.status(500).json({ message: "Error al obtener pagos" });
  }
};
