import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db/index.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import historialRoutes from "./routes/historialRoutes.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://pagadiario.online"
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/planes", planRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/historial", historialRoutes);

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
