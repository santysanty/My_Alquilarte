import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import {
  crearPropiedad,
  obtenerMisPropiedades,
  obtenerPropiedadPorId,
  actualizarPropiedad,
  eliminarPropiedad,
  mostrarMapa
} from '../controllers/propiedadController.js';

const router = express.Router();

// Ruta pública para mostrar el mapa con propiedades activas (vista)
router.get('/mapa', mostrarMapa);

// Crear propiedad (con imagen y autorización de propietario)
router.post(
  '/crear',
  protect,
  authorize(['propietario']),
  upload.single('imagen'), // multer para subir imagen
  crearPropiedad
);

// Obtener todas las propiedades del propietario autenticado
router.get(
  '/mis-propiedades',
  protect,
  authorize(['propietario']),
  obtenerMisPropiedades
);

// Obtener una propiedad por ID (solo del propietario autenticado)
router.get(
  '/:id',
  protect,
  authorize(['propietario']),
  obtenerPropiedadPorId
);

// Actualizar propiedad por ID (con imagen opcional)
router.put(
  '/:id',
  protect,
  authorize(['propietario']),
  upload.single('imagen'),
  actualizarPropiedad
);

// Eliminar propiedad por ID
router.delete(
  '/:id',
  protect,
  authorize(['propietario']),
  eliminarPropiedad
);

export default router;
