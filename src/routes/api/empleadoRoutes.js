// src/routes/empleadoRoutes.js
import multer from 'multer';
import express from 'express';
import * as empleadoController from '../../controllers/empleadoController.js';
import * as tareaController from '../../controllers/tareaController.js';



// Configuración de multer para subida de imágenes
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `foto-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

const router = express.Router();

// Crear nuevo empleado (proceso)
console.log('empleadoRoutes.js: Configurando ruta POST /empleados/nuevo');
router.post('/nuevo', upload.single('foto'), empleadoController.createEmpleado);

// Editar empleado (proceso)
console.log('empleadoRoutes.js: Configurando ruta PUT /empleados/:id');
router.put('/:id', upload.single('foto'), empleadoController.updateEmpleado);

// Lista de empleados
console.log('empleadoRoutes.js: Configurando ruta GET /empleados');
router.get('/', empleadoController.getAllEmpleados);

// Crear nuevo empleado (formulario)
console.log('empleadoRoutes.js: Configurando ruta GET /empleados/nuevo');
router.get('/nuevo', empleadoController.showNewEmpleadoForm);

// Crear nuevo empleado (proceso)
console.log('empleadoRoutes.js: Configurando ruta POST /empleados/nuevo');
router.post('/nuevo', empleadoController.createEmpleado);

// Editar empleado (formulario)
console.log('empleadoRoutes.js: Configurando ruta GET /empleados/:id/editar');
router.get('/:id/editar', empleadoController.showEditEmpleadoForm);


// Editar empleado (proceso)
console.log('empleadoRoutes.js: Configurando ruta POST /empleados/:id/editar');
router.put('/:id', empleadoController.updateEmpleado);

// Eliminar empleado y su usuario vinculado
console.log('empleadoRoutes.js: Configurando ruta DELETE /empleados/:id/eliminar');
router.delete('/:id/eliminar', empleadoController.deleteEmpleado);

// Ver detalle de un empleado
console.log('empleadoRoutes.js: Configurando ruta GET /empleados/:id');
router.get('/:id', empleadoController.showEmpleadoDetail);

// Buscar tareas por nombre y apellido (desde dashboardEmpleado)
console.log('empleadoRoutes.js: Configurando ruta GET /empleados/dashboard/buscar-tareas');
router.get('/dashboard/buscar-tareas', tareaController.buscarTareasPorNombreApellido);

export default router;
