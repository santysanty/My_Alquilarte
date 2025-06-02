// src/routes/indexRoutes.js

import { Router } from 'express';
// Importa tus controladores de inicio aquí, por ejemplo:
// import * as indexController from '../controllers/indexController.js';
// import { renderInicio, renderAdminDashboard, renderEmpleadoDashboard } from '../controllers/indexController.js'; // O tus funciones específicas

const router = Router();

// Define tus rutas generales aquí
// Ejemplo:
// router.get('/', indexController.renderInicio);
router.get('/inicio', indexController.renderInicio);
// router.get('/admin', indexController.renderAdminDashboard);
// router.get('/empleado', indexController.renderEmpleadoDashboard);
// ... y cualquier otra ruta que consideres "general" o de inicio

// ¡Asegúrate de tener esta línea al final del archivo!
export default router; // <-- ¡Esta es la exportación por defecto que app.js espera!