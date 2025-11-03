import { DataTypes } from "sequelize";
import db from "../db/index.js";


const Pago = db.define("Pago", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_nombre: { type: DataTypes.STRING, allowNull: false },
  metodo: { type: DataTypes.STRING, allowNull: false },
  referencia: { type: DataTypes.STRING, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },   // ✅ nuevo campo
  celular: { type: DataTypes.STRING, allowNull: false },  // ✅ nuevo campo
  monto: { type: DataTypes.FLOAT, allowNull: false },
  estado: { type: DataTypes.STRING, defaultValue: "pendiente" },
}, {
  tableName: "pagos",
  timestamps: true,
});

export default Pago;
