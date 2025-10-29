import pkg from "sequelize";
const { DataTypes } = pkg;
import { sequelize } from "../db/index.js";
import User from "./User.js";

// 🧩 Definición del modelo Plan
const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    llave: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Identificador del plan (Llave 1, Llave 2, etc.)",
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre del plan (ej: Plan Oro, Plan Plata)",
    },
    inversion_inicial: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto inicial de inversión o préstamo",
    },
    utilidad_mensual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Utilidad mensual generada por el plan",
    },
    goteo_diario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Monto diario recibido o pagado",
    },
    duracion_dias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duración del plan en días",
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Descripción adicional del plan",
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Orden de presentación del plan",
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      comment: "Monto total del préstamo o inversión",
    },
    cuotas: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Número total de cuotas del plan",
    },
    interes: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
      comment: "Porcentaje de interés aplicado al plan",
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "activo", "pagado", "cancelado"),
      defaultValue: "pendiente",
      comment: "Estado actual del plan",
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false, // ✅ permitir nulos para no romper tus planes existentes
      references: {
        model: "users", // usa el nombre exacto de la tabla
        key: "id",
      },
      comment: "ID del usuario creador del plan",
    },
  },
  {
    tableName: "planes",
    timestamps: false, // tu tabla no tiene createdAt ni updatedAt
  }
);

// 🔗 Relaciones
User.hasMany(Plan, { foreignKey: "usuarioId", as: "planes" });
Plan.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });

export default Plan;
