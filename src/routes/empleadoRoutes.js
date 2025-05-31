

// src/routes/empleadoRoutes.js

import express from 'express';
import * as empleadoController from '../controllers/empleadoController.js'; // Importa todas las exports del controlador de empleados

const router = express.Router(); // Utiliza express.Router() para crear un nuevo objeto router.

// Rutas del CRUD de Empleados
// NOTA: Los console.log son para depuración, puedes quitarlos al finalizar.

// 1. Ruta para listar todos los empleados (GET /empleados)
console.log('empleadoRoutes.js: Configurando ruta GET /empleados');
router.get('/', empleadoController.getAllEmpleados);

// 2. Ruta para mostrar el formulario de creación de un nuevo empleado (GET /empleados/nuevo)
console.log('empleadoRoutes.js: Configurando ruta GET /empleados/nuevo');
router.get('/nuevo', empleadoController.showNewEmpleadoForm);

// 3. Ruta para procesar la creación de un nuevo empleado (POST /empleados/nuevo)
console.log('empleadoRoutes.js: Configurando ruta POST /empleados/nuevo');
router.post('/nuevo', empleadoController.createEmpleado);

// 4. Ruta para mostrar el formulario de edición de un empleado específico (GET /empleados/:id/editar)
// El :id debe coincidir con empleadoID
console.log('empleadoRoutes.js: Configurando ruta GET /empleados/:id/editar');
router.get('/:id/editar', empleadoController.showEditEmpleadoForm);

// 5. Ruta para procesar la actualización de un empleado específico (POST /empleados/:id/editar)
// Aquí usamos POST y esperamos que method-override en app.js lo convierta a PUT si usas _method=PUT
console.log('empleadoRoutes.js: Configurando ruta POST /empleados/:id/editar');
router.post('/:id/editar', empleadoController.updateEmpleado);

// 6. Ruta para procesar la eliminación de un empleado específico (DELETE /empleados/:id/eliminar)
// Aquí usamos DELETE porque esperamos que method-override en app.js convierta la POST del formulario a DELETE.
console.log('empleadoRoutes.js: Configurando ruta DELETE /empleados/:id/eliminar');
router.delete('/:id/eliminar', empleadoController.deleteEmpleado);


// ¡Asegúrate de tener esta línea al final del archivo!
export default router; // Exporta el router para que pueda ser importado en app.js