// src/routes/indexRoutes.js

import { Router } from 'express';


const router = Router();

// Define tus rutas generales aquí
// Ejemplo:
// router.get('/', indexController.renderInicio);
router.get('/inicio', indexController.renderInicio);
// router.get('/admin', indexController.renderAdminDashboard);
// router.get('/empleado', indexController.renderEmpleadoDashboard);
// ... y cualquier otra ruta que consideres "general" o de inicio

export default router; 