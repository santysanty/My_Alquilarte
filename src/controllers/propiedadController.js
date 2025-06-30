import Propiedad from '../models/Propiedad.js';

// Retorna un array con propiedades activas (solo activos)
export const getPropiedadesActivas = async () => {
  return await Propiedad.find({ activo: true }).lean();
};

// Renderiza la vista del mapa con las propiedades activas serializadas para Pug
export const mostrarMapa = async (req, res) => {
  try {
    const propiedades = await getPropiedadesActivas();
    res.render('admin/mapaPropiedades', {
      title: 'Mapa de Propiedades',
      propiedades: JSON.stringify(propiedades), // para pasar a la vista en formato JSON
      isLoggedIn: !!req.user
    });
  } catch (error) {
    console.error('[CONTROLLER] Error al mostrar mapa:', error);
    res.status(500).render('error', { message: 'Error al mostrar el mapa' });
  }
};

// Crea una nueva propiedad, guarda la imagen si la hay y la asocia al usuario
export const crearPropiedad = async (req, res) => {
  try {
    const data = req.body;
    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const nueva = new Propiedad({
      ...data,
      imagenUrl,
      propietarioId: req.user._id,  // suponer que req.user viene del middleware auth
      activo: true
    });

    await nueva.save();
    res.status(201).json({ mensaje: 'Propiedad registrada', propiedad: nueva });
  } catch (error) {
    console.error('[CONTROLLER] Error al crear propiedad:', error);
    res.status(500).json({ mensaje: 'Error al guardar propiedad' });
  }
};

// Obtiene todas las propiedades del usuario logueado
export const obtenerMisPropiedades = async (req, res) => {
  try {
    const propiedades = await Propiedad.find({ propietarioId: req.user._id }).lean();
    res.json(propiedades);
  } catch (error) {
    console.error('[CONTROLLER] Error al obtener propiedades:', error);
    res.status(500).json({ mensaje: 'Error al obtener propiedades' });
  }
};

// Obtiene una propiedad por su ID
export const obtenerPropiedadPorId = async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id).lean();
    if (!propiedad) {
      return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
    }
    res.json(propiedad);
  } catch (error) {
    console.error('[CONTROLLER] Error al obtener propiedad por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener propiedad' });
  }
};

// Actualiza una propiedad por su ID
export const actualizarPropiedad = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (req.file) {
      data.imagenUrl = `/uploads/${req.file.filename}`;
    }

    const propiedadActualizada = await Propiedad.findByIdAndUpdate(id, data, { new: true });

    if (!propiedadActualizada) {
      return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
    }

    res.json({ mensaje: 'Propiedad actualizada', propiedad: propiedadActualizada });
  } catch (error) {
    console.error('[CONTROLLER] Error al actualizar propiedad:', error);
    res.status(500).json({ mensaje: 'Error al actualizar propiedad' });
  }
};

// Elimina una propiedad por su ID (puede ser lógica o física, aquí física)
export const eliminarPropiedad = async (req, res) => {
  try {
    const id = req.params.id;
    const propiedadEliminada = await Propiedad.findByIdAndDelete(id);

    if (!propiedadEliminada) {
      return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
    }

    res.json({ mensaje: 'Propiedad eliminada' });
  } catch (error) {
    console.error('[CONTROLLER] Error al eliminar propiedad:', error);
    res.status(500).json({ mensaje: 'Error al eliminar propiedad' });
  }
};
