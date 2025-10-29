// src/db/index.js
import pkg from "sequelize";
const { Sequelize } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,        // Nombre de la base de datos
  process.env.DB_USER,        // Usuario de MySQL
  process.env.DB_PASSWORD,    // ✅ corregido: variable correcta
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
  }
};
