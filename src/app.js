// src/app.js

import express from 'express';
import methodOverride from 'method-override';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

// Utils
import { leerJSON, escribirJSON } from './utils/jsonUtils.js';

// Rutas
import usuarioRoutes from './routes/usuarioRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar carpeta de uploads
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// Rutas
app.use('/usuario', usuarioRoutes);      // CRUD + login + inicio en uno solo
app.use('/empleados', empleadoRoutes);
app.use('/tareas', tareaRoutes);
app.use('/', usuarioRoutes);             //login

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
