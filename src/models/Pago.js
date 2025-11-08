import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import User from "./User.js"; // o la ruta correcta
import Plan from "./Plan.js";

Pago.belongsTo(User, { as: "usuario", foreignKey: "userId" });
User.hasMany(Pago, { foreignKey: "userId" });

const Pago = sequelize.define("Pago", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_id: { type: DataTypes.INTEGER, allowNull: true },
  plan_nombre: { type: DataTypes.STRING, allowNull: true },
  metodo: { type: DataTypes.STRING, allowNull: false },
  referencia: { type: DataTypes.STRING, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },   // ✅ nuevo campo
  celular: { type: DataTypes.STRING, allowNull: false },  // ✅ nuevo campo
  monto: { type: DataTypes.FLOAT, allowNull: true },
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
