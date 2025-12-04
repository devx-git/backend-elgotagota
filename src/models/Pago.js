import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import User from "./User.js"; // o la ruta correcta

const Pago = sequelize.define("Pago", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_id: { type: DataTypes.INTEGER, allowNull: true },
  plan_nombre: { type: DataTypes.STRING, allowNull: true },
  metodo: { type: DataTypes.STRING, allowNull: false },
  referencia: { type: DataTypes.STRING, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },   // ✅ nuevo campo
  celular: { type: DataTypes.STRING, allowNull: false },  // ✅ nuevo campo
  monto: { type: DataTypes.FLOAT, allowNull: true },
  ganancia_acumulada: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },
  estado: { type: DataTypes.STRING, defaultValue: "activo" },
  fecha_pago: {
  type: DataTypes.DATE,
  allowNull: true,
},
}, {
  tableName: "pagos",
  timestamps: true,
});

export default Pago;
