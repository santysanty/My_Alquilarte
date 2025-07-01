// src/routes/usuarioRoutes.js

import express from 'express';
import multer from 'multer';
import * as usuarioController from '../controllers/usuarioController.js';

const router = express.Router();

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

// Funcionalidades generales (inicio, login)

router.get('/login', usuarioController.renderLogin);
router.post('/login', usuarioController.procesarLogin);
router.get('/admin', (req, res) => {
  res.render('adminDashboard');
});
//empleados

// CRUD de usuarios (administrador)
router.get('/usuarios', usuarioController.getAllUsuarios);
router.get('/usuarios/nuevo', usuarioController.showNewUsuarioForm);
router.post('/usuarios/nuevo', upload.single('foto'), usuarioController.createUsuario);
router.get('/usuarios/:id/editar', usuarioController.showEditUsuarioForm);
router.put('/usuarios/:id', upload.single('foto'), usuarioController.updateUsuario);
router.delete('/usuarios/:id/eliminar', usuarioController.deleteUsuario);
router.get('/usuarios/:id', usuarioController.getUsuarioById);

// Redirección raíz al login
router.get('/', (req, res) => {
  res.redirect('/login');
});




export default router;

