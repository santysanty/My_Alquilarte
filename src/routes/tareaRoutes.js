// src/routes/tareaRoutes.js

import { Router } from 'express';
// Importa *solo* las funciones específicas que necesites desde el controlador
import {
  getTareas,
  createTarea, // <-- ¡Importación nombrada aquí!
  // updateTarea,
  // deleteTarea,
  // renderListaTareas,
  // renderNuevaTarea,
  // renderEditarTarea
} from '../controllers/tareaController.js'; // Asegúrate de que la ruta sea correcta

const router = Router();

// Rutas API
router.get('/api/tareas', getTareas);
router.post('/api/tareas', createTarea); // Usando la función importada

// Rutas para vistas Pug
router.get('/', getTareas); // O a la función que renderiza la lista
router.get('/nueva', /* función que renderiza la vista de nueva tarea */);
router.post('/nueva', createTarea); // Usando la función importada

// ... (otras rutas)

export default router;