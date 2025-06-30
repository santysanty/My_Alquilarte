import express from 'express';
const router = express.Router();

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserDetails,  // <-- Importa la nueva función
    // assignUserFunction
} from '../../controllers/adminUserController.js';

import { protect, authorize } from '../../middlewares/authMiddleware.js';

// Obtener todos los usuarios con filtros opcionales (?role=...&searchTerm=...)
router.get('/', protect, authorize(['admin']), getAllUsers);

// Crear un nuevo usuario
router.post('/', protect, authorize(['admin']), createUser);

// Operaciones con un usuario específico por ID
router.route('/:id')
    .get(protect, authorize(['admin']), getUserById)
    .put(protect, authorize(['admin']), updateUser)
    .delete(protect, authorize(['admin']), deleteUser);

// Nueva ruta para ver detalles limitados sin datos sensibles
router.get('/:id/details', protect, authorize(['admin']), getUserDetails);

// Ruta opcional para asignar función a un empleado
// router.put('/:id/assign-function', protect, authorize(['admin']), assignUserFunction);

export default router;
