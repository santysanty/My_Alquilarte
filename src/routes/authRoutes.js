// src/routes/authRoutes.js

import { Router } from 'express';
// ¡Importa las funciones específicas del controlador de autenticación!
import { renderLogin, processLogin } from '../controllers/authController.js';

const router = Router();

// Define la ruta GET para mostrar el formulario de login
router.get('/login', renderLogin);

// Define la ruta POST para procesar los datos del formulario de login
router.post('/login', processLogin);

// Puedes añadir otras rutas relacionadas con la autenticación aquí, por ejemplo, para cerrar sesión
// router.get('/logout', logout); // Si implementas una función 'logout' en authController.js

// ¡Es CRUCIAL exportar la instancia del Router como el valor por defecto de este módulo!
export default router;