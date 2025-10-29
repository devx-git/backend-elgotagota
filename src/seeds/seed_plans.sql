-- Crear base de datos (si aún no existe)
CREATE DATABASE IF NOT EXISTS paga_diario CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE paga_diario;

-- Usuarios
CREATE TABLE usuarios (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(128) UNIQUE,        -- si sigues usando Firebase UIDs; opcional
  nombre VARCHAR(200),
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(500),     -- si guardas hash local (bcrypt), opcional si usas OAuth
  rol VARCHAR(50) DEFAULT 'usuario',
  plan_activo INT DEFAULT NULL,
  dias_transcurridos INT DEFAULT 0,
  saldo_actual DECIMAL(14,2) DEFAULT 0,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Planes
CREATE TABLE planes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  llave VARCHAR(50) NOT NULL,   -- "Llave 1" ... "Llave 10"
  nombre VARCHAR(100),
  inversion_inicial BIGINT,     -- almacenar como entero COP
  utilidad_mensual BIGINT,
  goteo_diario BIGINT,
  duracion_dias INT DEFAULT 30,
  descripcion TEXT,
  orden INT DEFAULT 0
);

-- Pagos / compras
CREATE TABLE pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  plan_id INT,
  plan_nombre VARCHAR(100),
  metodo VARCHAR(100),
  referencia VARCHAR(200),
  monto DECIMAL(14,2),
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (plan_id) REFERENCES planes(id) ON DELETE SET NULL
);

-- Transacciones / historial (opcional)
CREATE TABLE transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  tipo VARCHAR(100),
  monto DECIMAL(14,2),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  descripcion TEXT,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
