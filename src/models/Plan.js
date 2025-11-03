import pkg from "sequelize";
const { DataTypes } = pkg;
import { sequelize } from "../db/index.js";
import User from "./User.js";

// 🧩 Definición del modelo Plan
const Plan = sequelize.define(
  "Plan", 
  {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.INTEGER, allowNull: false },
  inversion_inicial: { type: DataTypes.FLOAT, allowNull: false },
  utilidad_mensual: { type: DataTypes.FLOAT, allowNull: false },
  descripcion: { type: DataTypes.STRING },
  orden: { type: DataTypes.INTEGER },
}, {
  tableName: "planes",
  timestamps: false,
});


// 🔗 Relaciones
User.hasMany(Plan, { foreignKey: "usuarioId", as: "planes" });
Plan.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

export default Plan;
