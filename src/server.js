import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db/index.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/compras", compraRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente.");
    await sequelize.sync({ alter: true });
    console.log("🗄️ Modelos sincronizados con la base de datos.");
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
});
