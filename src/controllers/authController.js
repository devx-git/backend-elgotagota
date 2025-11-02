import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey123";

// Registro
export const register = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    const userExists = await User.findOne({ where: { correo } });
    if (userExists) return res.status(400).json({ message: "Correo ya registrado" });

    const user = await User.create({ nombre, correo, password, rol });
    res.status(201).json({ message: "Usuario registrado con éxito", user });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const user = await User.findOne({ where: { correo } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await user.validPassword(password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
  message: "Inicio de sesión exitoso",
  token,
  user: {
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
  }
});
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Verificar token
export const verificar = async (req, res) => {
  try {
    const usuario = req.usuario;
    res.json({ message: "Token válido", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar token", error });
  }
};
