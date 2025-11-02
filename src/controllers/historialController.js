export const obtenerHistorial = async (req, res) => {
  try {
    const userId = req.user.id;
    // Aquí puedes consultar historial real desde la base de datos
    res.json({ historial: [`Historial simulado para usuario ${userId}`] });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error });
  }
};
