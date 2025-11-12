import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const Retiro = sequelize.define("Retiro", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pago_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  titular: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_cuenta: {
    type: DataTypes.ENUM("ahorros", "corriente", "nequi", "daviplata"),
    allowNull: false
  },
  numero_cuenta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "procesado", "rechazado"),
    defaultValue: "pendiente"
  }
});

export default Retiro;
