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
 * 🟢 Obtener todos los planes (disponible para todos) - CORREGIDO
 */
export const getPlanes = async (req, res) => {
  try {
    const planes = await Plan.findAll({ order: [["id", "ASC"]] });

    const planesConCalculos = planes.map(plan => {
      const inversion = plan.inversion_inicial;
      const ganancia = plan.utilidad_mensual;
      
      // CALCULO CORREGIDO: Total a recibir (inversión + ganancia)
      const totalRecibir = inversion + ganancia;
      
      // GOTEO DIARIO CORREGIDO: Total ÷ 30 días (en lugar de solo ganancia ÷ 30)
      const goteoDiario = totalRecibir / 30;

      return {
        id: plan.id,
        numero: plan.id,
        inversion: inversion,
        ganancia: ganancia,
        diario: parseFloat(goteoDiario.toFixed(2)), // ← AHORA del TOTAL
        total: totalRecibir,
        descripcion: plan.descripcion,
        
        // DATOS ADICIONALES PARA MEJOR VISUALIZACIÓN
        inversion_formateada: `$${inversion.toLocaleString()}`,
        ganancia_formateada: `$${ganancia.toLocaleString()}`,
        diario_formateado: `$${goteoDiario.toFixed(2).toLocaleString()}`,
        total_formateado: `$${totalRecibir.toLocaleString()}`,
        dias_duracion: 30 // Puedes hacerlo dinámico si lo necesitas
      };
    });

    res.json(planesConCalculos);
  } catch (error) {
    console.error("❌ Error obteniendo planes:", error);
    res.status(500).json({ message: "Error obteniendo planes" });
  }
};

/**
 * 🟣 Obtener plan por ID (disponible para todos) - ACTUALIZADO
 */
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

    // Aplicar mismo cálculo corregido para consistencia
    const inversion = plan.inversion_inicial;
    const ganancia = plan.utilidad_mensual;
    const totalRecibir = inversion + ganancia;
    const goteoDiario = totalRecibir / 30;

    const planConCalculos = {
      ...plan.toJSON(),
      diario: parseFloat(goteoDiario.toFixed(2)),
      total: totalRecibir,
      inversion_formateada: `$${inversion.toLocaleString()}`,
      ganancia_formateada: `$${ganancia.toLocaleString()}`,
      diario_formateado: `$${goteoDiario.toFixed(2).toLocaleString()}`,
      total_formateado: `$${totalRecibir.toLocaleString()}`
    };

    res.json(planConCalculos);
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
    
    // Aplicar cálculos corregidos a los resultados de búsqueda
    const planesConCalculos = plans.map(plan => {
      const inversion = plan.inversion_inicial;
      const ganancia = plan.utilidad_mensual;
      const totalRecibir = inversion + ganancia;
      const goteoDiario = totalRecibir / 30;

      return {
        ...plan.toJSON(),
        diario: parseFloat(goteoDiario.toFixed(2)),
        total: totalRecibir
      };
    });

    res.json(planesConCalculos);
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