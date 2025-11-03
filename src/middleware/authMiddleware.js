import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET;

export const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      console.error("❌ Token no proporcionado");
      return res.status(403).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.error("❌ Usuario no encontrado con ID:", decoded.id);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    };

    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};


/**
 * 👑 Middleware para restringir acceso solo a administradores.
 */
export const esAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso restringido a administradores" });
  }
  next();
};

/**
 * 🎯 Middleware flexible para verificar cualquier rol permitido.
 * Ejemplo de uso: verificarRol(["admin", "cliente"])
 */
export const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(", ")}`,
      });
    }

    next();
  };
};
