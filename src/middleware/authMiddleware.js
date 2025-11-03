import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET;


/**
 * ✅ Verifica si el token JWT es válido y el usuario existe.
 * - Extrae el token del header Authorization.
 * - Decodifica el token y busca el usuario en la base de datos.
 * - Adjunta el usuario autenticado a req.user.
 */
export const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token no proporcionado" });

    const decoded = jwt.verify(token, SECRET_KEY);

    // Buscar el usuario real en la base de datos
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    req.user = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    };

    console.log("✅ Usuario autenticado:", req.user); // <-- útil para verificar rol en consola

    next();
  } catch (error) {
    console.error("❌ Error en verificación de token:", error.message);
    res.status(401).json({ message: "Token inválido o expirado" });
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
