export const obtenerPagos = async (req, res) => {
  try {
    const userId = req.user.id;
    // Aquí puedes consultar pagos reales desde la base de datos
    res.json({ pagos: [`Pago simulado para usuario ${userId}`] });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pagos", error });
  }
};
