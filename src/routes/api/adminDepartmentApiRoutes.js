// src/routes/api/adminDepartmentApiRoutes.js

import express from 'express';
import { protect, authorize } from '../../middlewares/authMiddleware.js';
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from '../../controllers/departamentoController.js';
import Departamento from '../../models/Departamento.js';

const router = express.Router();

// Ruta auxiliar para obtener departamentos en formato JSON (para selects, etc.)
router.get('/departments/json', protect, authorize(['admin']), async (req, res) => {
  try {
    const departamentos = await Departamento.find().lean();
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener departamentos' });
  }
});

// CRUD completo para departamentos
router.get('/departments', protect, authorize(['admin']), getAllDepartments);
router.get('/departments/:id', protect, authorize(['admin']), getDepartmentById);
router.post('/departments', protect, authorize(['admin']), createDepartment);
router.put('/departments/:id', protect, authorize(['admin']), updateDepartment);
router.delete('/departments/:id', protect, authorize(['admin']), deleteDepartment);

export default router;
