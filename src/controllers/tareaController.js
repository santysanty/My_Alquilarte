// src/controllers/tareaController.js

// Asegúrate de importar Tarea y jsonHandler aquí si los usas
import Tarea from '../models/Tarea.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonHandler.js';

const DB_TAREAS = './data/tareas.json'; // O la ruta correcta a tu JSON de tareas

// ... (otras funciones del controlador, si las tienes)

export const createTarea = async (req, res) => { // <-- ¡Aquí está el 'export'!
    const { titulo, descripcion, estado, prioridad, fecha, area, empleadoId } = req.body;
    const tareas = await readJsonFile(DB_TAREAS);
    // Generar ID único automáticamente si tu Tarea.js no lo hace o si prefieres aquí
    const nuevaId = tareas.length ? Math.max(...tareas.map(t => t.id)) + 1 : 1;
    const nueva = new Tarea(nuevaId, titulo, descripcion, estado, prioridad, fecha, area, parseInt(empleadoId));
    tareas.push(nueva);
    await writeJsonFile(tareas);
    res.redirect('/tareas'); // O a donde corresponda después de crear
};

// Si tienes otras funciones, también deben ser exportadas:
export const getTareas = async (req, res) => {
    // ... tu lógica para obtener tareas
};

// ... y así sucesivamente para updateTarea, deleteTarea, renderListaTareas, etc.