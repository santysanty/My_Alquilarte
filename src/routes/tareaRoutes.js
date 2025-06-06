import express from 'express';
import * as tareaController from '../controllers/tareaController.js'; // Importa todas las exports


const router = express.Router();


// Rutas del CRUD de Tareas
console.log('tareaRoutes.js: Configurando ruta GET /tareas'); // Nuevo log
router.get('/', tareaController.getAllTareas); // GET para listar todas las tareas (con filtros)

console.log('tareaRoutes.js: Configurando ruta GET /tareas/nueva'); // Nuevo log
router.get('/nueva', tareaController.showNewTareaForm); // GET para mostrar formulario de nueva tarea

console.log('tareaRoutes.js: Configurando ruta POST /tareas/nueva'); // Nuevo log
router.post('/nueva', tareaController.createTarea); // POST para crear nueva tarea

// Rutas para edición y eliminación (con sus formularios o acciones directas)
// El :id debe coincidir con tareaID en tu JSON
console.log('tareaRoutes.js: Configurando ruta GET /tareas/:id/editar'); // Nuevo log
router.get('/:id/editar', tareaController.showEditTareaForm); // GET para mostrar formulario de edición

console.log('tareaRoutes.js: Configurando ruta POST /tareas/:id/editar'); // **Log que faltaba**
router.post('/:id/editar', tareaController.updateTarea); // POST para actualizar tarea (simula PUT)



console.log('tareaRoutes.js: Configurando ruta DELETE /tareas/:id/eliminar'); // **LOG Y RUTA ACTUALIZADOS**
router.delete('/:id/eliminar', tareaController.deleteTarea); // **¡CAMBIO CLAVE AQUÍ: de POST a DELETE!**
// Ver detalle de una tarea
router.get('/:id', tareaController.showTareaDetail);


router.get('/empleados/dashboard/buscar-tareas', tareaController.buscarTareasPorNombreApellido);



export default router; // Usa export default para el import de app.js