// models/Compra.js
import { DataTypes } from "sequelize";
import { sequelize } from  "../db/index.js";
import User from "./User.js";
import Plan from "./Plan.js";

const Compra = sequelize.define("Compra", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaCompra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  valorPagado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "pagado", "cancelado"),
    allowNull: false,
    defaultValue: "pendiente",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: "compras",
});

// Relaciones
Compra.belongsTo(User, { foreignKey: "userId", as: "usuario" });
Compra.belongsTo(Plan, { foreignKey: "planId", as: "plan" });

export default Compra;
