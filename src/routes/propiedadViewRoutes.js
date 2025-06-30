// routes/propiedadViewRoutes.js
import express from 'express';
import { getPropiedadesActivas, mostrarMapa } from '../controllers/propiedadController.js';

const router = express.Router();


router.get('/api/propiedades', async (req, res) => {
  try {
    const propiedades = await getPropiedadesActivas();
    res.json(propiedades);
  } catch (error) {
    console.error('[API] Error al obtener propiedades activas:', error);
    res.status(500).json({ error: 'Error al obtener propiedades activas' });
  }
});


router.get('/mapa', mostrarMapa);

export default router;
