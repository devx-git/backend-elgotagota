import Plan from "./Plan.js";
import Pago from "./Pago.js";

export default function defineAssociations() {
  Plan.hasMany(Pago, { foreignKey: "plan_id", as: "pagos" });
  Pago.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" });
}
