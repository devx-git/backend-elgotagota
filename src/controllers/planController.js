import Plan from "../models/Plan.js";

/**
 * 🧩 Verifica si el usuario autenticado es administrador
 */
const verificarAdmin = (req, res) => {
  if (!req.user || req.user.rol !== "admin") {
    res.status(403).json({ message: "Acceso denegado. Solo para administradores." });
    return false;
  }
  return true;
};

/**
 * 🟢 Obtener todos los planes (disponible para todos)
 */
export const getPlanes = async (req, res) => {
  try {
    const planes = await Plan.findAll({ order: [["orden", "ASC"]] });
    const planesConCalculos = planes.map(plan => {
    const mensual = plan.utilidadMensual;
    const diario = mensual / 30;
    const total = plan.inversionInicial + mensual;

  return {
    id: plan.id,
    nombre: `Llave ${plan.numero}`,
    inversion: plan.inversionInicial,
    ganancia: mensual,
    diario: parseFloat(diario.toFixed(2)),
    total,
    descripcion: plan.descripcion,
  };
});

res.json(planesConCalculos);
  } catch (error) {
    console.error("❌ Error obteniendo planes:", error);
    res.status(500).json({ message: "Error obteniendo planes" });
  }
};

/**
 * 🟣 Obtener plan por ID (disponible para todos)
 */
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    res.json(plan);
  } catch (error) {
    console.error("❌ Error obteniendo plan por ID:", error);
    res.status(500).json({ message: "Error obteniendo plan" });
  }
};

// Buscar planes por nombre o estado (ejemplo: /api/plans/search?nombre=Llave)
export const searchPlans = async (req, res) => {
  try {
    const { nombre, estado } = req.query;
    const where = {};

    if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
    if (estado) where.estado = estado;

    const plans = await Plan.findAll({ where });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error en la búsqueda", error });
  }
};

/**
 * 🔵 Crear plan (solo administrador)
 */
export const createPlan = async (req, res) => {
  if (!verificarAdmin(req, res)) return;

  try {
    const { numero, inversionInicial, utilidadMensual, descripcion } = req.body;

    // Validaciones básicas
    if (!numero || !inversionInicial || !utilidadMensual) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Evitar duplicados
    const existe = await Plan.findOne({ where: { numero } });
    if (existe) {
      return res.status(400).json({ message: "Ya existe un plan con ese número" });
    }

    const nuevo = await Plan.create({
      numero,
      inversionInicial,
      utilidadMensual,
      descripcion,
    });

    res.status(201).json({ message: "Plan creado correctamente", plan: nuevo });
  } catch (error) {
    console.error("❌ Error creando plan:", error);
    res.status(500).json({ message: "Error creando plan" });
  }
};

/**
 * 🟠 Actualizar plan (solo administrador)
 */
export const updatePlan = async (req, res) => {
  if (!verificarAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const { numero, inversionInicial, utilidadMensual, descripcion } = req.body;

    const plan = await Plan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    plan.numero = numero ?? plan.numero;
    plan.inversionInicial = inversionInicial ?? plan.inversionInicial;
    plan.utilidadMensual = utilidadMensual ?? plan.utilidadMensual;
    plan.descripcion = descripcion ?? plan.descripcion;

    await plan.save();
    res.json({ message: "Plan actualizado correctamente", plan });
  } catch (error) {
    console.error("❌ Error actualizando plan:", error);
    res.status(500).json({ message: "Error actualizando plan" });
  }
};

/**
 * 🔴 Eliminar plan (solo administrador)
 */
export const deletePlan = async (req, res) => {
  if (!verificarAdmin(req, res)) return;

  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    await plan.destroy();
    res.json({ message: "Plan eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando plan:", error);
    res.status(500).json({ message: "Error eliminando plan" });
  }
};
