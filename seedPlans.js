import { Plan } from "./src/models/Plan.js";
import { connectDB, sequelize } from "./src/db/index.js";

const seedPlans = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });

  const basePlans = Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    const price = num * 10000;
    const daily = price * 0.1;
    const monthly = daily * 30;
    return {
      llave: `Llave ${num}`,
      inversionInicial: price,
      utilidadMensual: monthly,
      duracionDias: 30,
      descripcion: "Plan de inversión escalonado",
    };
  });

  await Plan.bulkCreate(basePlans);
  console.log("✅ Planes insertados correctamente");
  process.exit();
};

seedPlans();
