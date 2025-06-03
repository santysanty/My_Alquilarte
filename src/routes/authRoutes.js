// src/routes/authRoutes.js

import { Router } from 'express';
import { renderLogin, processLogin } from '../controllers/authController.js';

const router = Router();

// Define la ruta GET para mostrar el formulario de login
router.get('/login', renderLogin);

// Define la ruta POST para procesar los datos del formulario de login
router.post('/login', processLogin);


export default router;