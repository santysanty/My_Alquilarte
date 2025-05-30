// src/controllers/tareaController.js

// Importaciones necesarias
import Tarea from '../models/Tarea.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonHandler.js';

// Define SOLO el nombre del archivo JSON. La ruta completa a la carpeta 'data' es manejada por jsonHandler.js
const DB_TAREAS_FILENAME = 'tareas.json';

// Función auxiliar para leer todas las tareas
const getTareasData = async () => {
    let tareas = []; // <--- AÑADE ESTA LÍNEA: Inicializa tareas a un array vacío
    try {
        // Usa el nombre del archivo aquí
        tareas = await readJsonFile(DB_TAREAS_FILENAME);
        return Array.isArray(tareas) ? tareas : [];
    } catch (error) {
        console.error("Error al leer el archivo de tareas:", error);
        return []; // Siempre retorna un array
    }
};

/**
 * Muestra la lista de tareas, con opciones de filtro.
 * GET /tareas
 */
export const getAllTareas = async (req, res) => {
    try {
        let tareas = await getTareasData();

        const { estado, prioridad, area, busqueda } = req.query;

        if (estado && estado !== 'todos') {
            tareas = tareas.filter(tarea => tarea.estado.toLowerCase() === estado.toLowerCase());
        }
        if (prioridad && prioridad !== 'todas') {
            tareas = tareas.filter(tarea => tarea.prioridad.toLowerCase() === prioridad.toLowerCase());
        }
        if (area && area !== 'todas') {
            tareas = tareas.filter(tarea => tarea.area.toLowerCase() === area.toLowerCase());
        }
        if (busqueda) {
            const searchTerm = busqueda.toLowerCase();
            tareas = tareas.filter(tarea =>
                tarea.titulo.toLowerCase().includes(searchTerm) ||
                tarea.descripcion.toLowerCase().includes(searchTerm)
            );
        }

        res.render('listaTareas', {
            title: 'Lista de Tareas',
            tareas: tareas,
            currentEstado: estado || 'todos',
            currentPrioridad: prioridad || 'todas',
            currentArea: area || 'todas',
            currentBusqueda: busqueda || ''
        });

    } catch (error) {
        console.error('Error al obtener la lista de tareas:', error);
        res.status(500).render('error', { message: 'Error interno del servidor al cargar tareas.', detail: error.message });
    }
};

/**
 * Muestra el formulario para crear una nueva tarea.
 * GET /tareas/nueva
 */
export const showNewTareaForm = (req, res) => {
    res.render('nuevaTarea', {
        title: 'Crear Nueva Tarea',
        areas: ['Ventas', 'Administración', 'Contabilidad', 'Mantenimiento'],
        estados: ['pendiente', 'en progreso', 'completada'],
        prioridades: ['baja', 'media', 'alta']
    });
};

/**
 * Crea una nueva tarea y la guarda en el JSON.
 * POST /tareas/nueva
 */
export const createTarea = async (req, res) => {
    try {
        const tareas = await getTareasData();
        const { titulo, descripcion, estado, prioridad, fecha, area, empleadoId } = req.body;

        const newId = tareas.length > 0 ? Math.max(...tareas.map(t => t.tareaID)) + 1 : 1;

        const nuevaTarea = new Tarea(
            newId,
            titulo,
            descripcion,
            estado,
            prioridad,
            fecha,
            area,
            empleadoId ? parseInt(empleadoId) : null,
            '',
            false
        );

        tareas.push(nuevaTarea);
        // Usa el nombre del archivo aquí
        await writeJsonFile(DB_TAREAS_FILENAME, tareas);
        res.redirect('/tareas');
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).render('error', { message: 'Error interno del servidor al crear tarea.', detail: error.message });
    }
};

/**
 * Muestra el formulario para editar una tarea existente.
 * GET /tareas/:id/editar
 */
export const showEditTareaForm = async (req, res) => {
    try {
        const tareas = await getTareasData();
        const tarea = tareas.find(t => t.tareaID.toString() === req.params.id);

        if (!tarea) {
            return res.status(404).render('error', { message: 'Tarea no encontrada.', detail: `La tarea con ID ${req.params.id} no existe.` });
        }

        res.render('editarTarea', {
            title: `Editar Tarea: ${tarea.titulo}`,
            tarea: tarea,
            areas: ['Ventas', 'Administración', 'Contabilidad', 'Mantenimiento'],
            estados: ['pendiente', 'en progreso', 'completada'],
            prioridades: ['baja', 'media', 'alta']
        });
    } catch (error) {
        console.error('Error al cargar la tarea para edición:', error);
        res.status(500).render('error', { message: 'Error interno del servidor al cargar tarea para edición.', detail: error.message });
    }
};

/**
 * Actualiza una tarea existente en el JSON.
 * POST /tareas/:id/editar (usando method-override para simular PUT)
 */
export const updateTarea = async (req, res) => {
    try {
        let tareas = await getTareasData();
        const index = tareas.findIndex(t => t.tareaID.toString() === req.params.id);

        if (index === -1) {
            return res.status(404).render('error', { message: 'Tarea no encontrada para actualizar.', detail: `La tarea con ID ${req.params.id} no existe.` });
        }

        const { titulo, descripcion, estado, prioridad, fecha, area, empleadoId, informe, finalizada } = req.body;

        const updatedTarea = new Tarea(
            tareas[index].tareaID,
            titulo,
            descripcion,
            estado,
            prioridad,
            fecha,
            area,
            empleadoId ? parseInt(empleadoId) : null,
            informe || '',
            finalizada === 'on' ? true : false
        );

        tareas[index] = updatedTarea;
        await writeJsonFile(DB_TAREAS_FILENAME, tareas);
        res.redirect('/tareas');
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).render('error', { message: 'Error interno del servidor al actualizar tarea.', detail: error.message });
    }
};

/**
 * Elimina una tarea del JSON.
 * POST /tareas/:id/eliminar (usando method-override para simular DELETE)
 */
export const deleteTarea = async (req, res) => {
    try {
        console.log('--- INICIO DEPURACIÓN DELETE TAREA ---');
        console.log('ID recibido en la petición (req.params.id):', req.params.id, 'Tipo:', typeof req.params.id);

        let tareas = await getTareasData();
        console.log('Tareas leídas del JSON (IDs):', tareas.map(t => t.tareaID));
        const initialLength = tareas.length;
        console.log('Longitud inicial del array de tareas:', initialLength);

        tareas = tareas.filter(t => {
            const tareaIdString = t.tareaID.toString();
            const match = tareaIdString === req.params.id;
            console.log(`Comparando tarea.tareaID (${tareaIdString}) con req.params.id (${req.params.id}). Coincide: ${match}`);
            return !match;
        });

        console.log('Tareas después de filtrar (IDs restantes):', tareas.map(t => t.tareaID));
        console.log('Longitud final del array de tareas después de filtrar:', tareas.length);

        if (tareas.length === initialLength) {
            console.warn(`No se encontró tarea con ID ${req.params.id} para eliminar. La longitud del array no cambió.`);
            return res.status(404).render('error', { message: 'Tarea no encontrada para eliminar.', detail: `La tarea con ID ${req.params.id} no existe o no se pudo filtrar.` });
        }

        console.log('Tarea eliminada del array en memoria. Intentando escribir en el archivo JSON...');
        await writeJsonFile(DB_TAREAS_FILENAME, tareas);
        console.log('Archivo JSON actualizado con éxito.');
        res.redirect('/tareas');
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).render('error', { message: 'Error interno del servidor al eliminar tarea.', detail: error.message });
    } finally {
        console.log('--- FIN DEPURACIÓN DELETE TAREA ---');
    }
};