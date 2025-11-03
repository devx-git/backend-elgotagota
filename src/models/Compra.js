// models/Compra.js
import { DataTypes } from "sequelize";
import { sequelize } from  "../db/index.js";
import User from "./User.js";
import Plan from "./Plan.js";

const Compra = sequelize.define("Compra", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valorPagado: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "pagado", "cancelado"),
    defaultValue: "pendiente",
  },
  fechaCompra: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "compras",
  timestamps: false,
});

// Relaciones
Compra.belongsTo(User, { foreignKey: "userId", as: "usuario" });
Compra.belongsTo(Plan, { foreignKey: "planId", as: "plan" });

export default Compra;
