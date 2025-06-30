import express from 'express';
import { getPropiedadesActivas, mostrarMapa } from '../../controllers/propiedadController.js';

const router = express.Router();

// Ruta API para obtener propiedades en JSON
router.get('/api/propiedades', async (req, res) => {
  try {
    const propiedades = await getPropiedadesActivas();
    res.json(propiedades);
  } catch (error) {
    console.error('[API] Error al obtener propiedades:', error);
    res.status(500).json({ error: 'Error al obtener propiedades' });
  }
});

// Ruta para mostrar el mapa con propiedades
router.get('/mapa-propiedades', mostrarMapa);

export default router;
