// middleware/roleMiddleware.js
export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};
