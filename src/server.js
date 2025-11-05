import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db/index.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import pagoRoutes from "./routes/pagoRoutes.js";
import historialRoutes from "./routes/historialRoutes.js";
import defineAssociations from "./models/associations.js";

dotenv.config();
defineAssociations(); // ✅ activa las relaciones

const app = express(); // ✅ define app antes de usarla

const allowedOrigins = [
  "http://localhost:5173",
  "https://pagadiario.online"
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Asegura que las preflight OPTIONS sean respondidas correctamente
app.options("*", cors(corsOptions));

app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/planes", planRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/pagos", pagoRoutes);
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
