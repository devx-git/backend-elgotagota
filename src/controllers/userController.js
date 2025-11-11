import { User } from "../models/User.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Crear usuario (solo admin)
export const createUser = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    const existing = await User.findOne({ where: { correo } });
    if (existing) return res.status(400).json({ message: "Correo ya registrado" });
    const newUser = await User.create({ nombre, correo, password, rol });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    await user.update(req.body);
    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

// Obtener el perfil del usuario autenticado
export const getPerfil = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { id, nombre, correo, rol } = req.user;
    res.json({ id, nombre, correo, rol });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil", error });
  }
};
