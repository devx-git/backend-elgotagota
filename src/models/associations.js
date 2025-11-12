import Pago from "./Pago.js";
import Plan from "./Plan.js";
import User from "./User.js";
import Retiro from "./Retiro.js";

export default function defineAssociations() {
  // Relación con Plan
  Plan.hasMany(Pago, { foreignKey: "plan_id", as: "pagos" });
  Pago.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" });

  // Relación con Usuario
  User.hasMany(Pago, { foreignKey: "user_id", as: "pagos" });
  Pago.belongsTo(User, { foreignKey: "user_id", as: "usuario" });

  Retiro.belongsTo(User, { foreignKey: "user_id" });
  Retiro.belongsTo(Pago, { foreignKey: "pago_id" });
}
