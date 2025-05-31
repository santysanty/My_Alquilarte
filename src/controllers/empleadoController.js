// src/controllers/empleadoController.js

import Empleado from '../models/Empleado.js'; // Asegúrate de que esta ruta sea correcta
import { readJsonFile, writeJsonFile } from '../utils/jsonHandler.js'; // Asegúrate de que esta ruta sea correcta
import { generateUniqueId } from '../utils/idGenerator.js'; // Asegúrate de que este archivo exista y exporte generateUniqueId

const EMPLEADOS_FILE = 'empleados.json'; // Nombre del archivo JSON para empleados

// --- FUNCIONES DEL CONTROLADOR ---

// 1. Mostrar la lista de todos los empleados (GET /cuenta o GET /empleados si lo usas en ruta)
export const getAllEmpleados = async (req, res) => {
    console.log('empleadoController: getAllEmpleados llamado.');
    try {
        const empleados = await readJsonFile(EMPLEADOS_FILE);

        // Implementación de filtros (similar a tareas)
        const filtroRol = req.query.filtroRol || '';
        const busquedaEmpleado = req.query.busquedaEmpleado ? req.query.busquedaEmpleado.toLowerCase() : '';

        let empleadosFiltrados = empleados;

        if (filtroRol) {
            empleadosFiltrados = empleadosFiltrados.filter(
                empleado => empleado.rol && empleado.rol.toLowerCase() === filtroRol.toLowerCase()
            );
        }

        if (busquedaEmpleado) {
            empleadosFiltrados = empleadosFiltrados.filter(empleado =>
                (empleado.nombre && empleado.nombre.toLowerCase().includes(busquedaEmpleado)) ||
                (empleado.apellido && empleado.apellido.toLowerCase().includes(busquedaEmpleado)) ||
                (empleado.usuario && empleado.usuario.toLowerCase().includes(busquedaEmpleado)) ||
                (empleado.dni && empleado.dni.includes(busquedaEmpleado)) ||
                (empleado.correoElectronico && empleado.correoElectronico.toLowerCase().includes(busquedaEmpleado))
            );
        }

        // Renderiza la vista listaEmpleados.pug
        res.render('listaEmpleados', {
            empleados: empleadosFiltrados,
            filtroRol: filtroRol,
            busquedaEmpleado: busquedaEmpleado
        });
    } catch (error) {
        console.error('empleadoController: Error al obtener empleados:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor al cargar empleados.' });
    }
};

// 2. Mostrar el formulario para crear un nuevo empleado (GET /cuenta/nuevo)
export const showNewEmpleadoForm = (req, res) => {
    console.log('empleadoController: showNewEmpleadoForm llamado.');
    // Renderiza la vista nuevoEmpleado.pug
    res.render('nuevoEmpleado');
};

// 3. Crear un nuevo empleado (POST /cuenta/nuevo)
export const createEmpleado = async (req, res) => {
    console.log('empleadoController: createEmpleado llamado.');
    try {
        const empleados = await readJsonFile(EMPLEADOS_FILE);
        const { nombre, apellido, dni, correoElectronico, telefono, usuario, contrasena, rol } = req.body;

        // Generar un ID único para el nuevo empleado
        const empleadoID = generateUniqueId(); // Usamos la función importada

        const newEmpleado = new Empleado(
            empleadoID,
            nombre,
            apellido,
            dni,
            correoElectronico,
            telefono,
            usuario,
            contrasena, // En un entorno real, la contraseña se hashearía aquí
            rol
            // La foto se manejaría con Multer si se implementa la subida de archivos
        );

        empleados.push(newEmpleado);
        await writeJsonFile(EMPLEADOS_FILE, empleados);

        console.log(`empleadoController: Empleado ${newEmpleado.nombre} ${newEmpleado.apellido} creado con ID: ${empleadoID}`);
        res.redirect('/cuenta'); // Redirige a la lista de empleados después de crear
    } catch (error) {
        console.error('empleadoController: Error al crear empleado:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor al crear el empleado.' });
    }
};

// 4. Mostrar el formulario de edición de un empleado específico (GET /cuenta/:id/editar)
export const showEditEmpleadoForm = async (req, res) => {
    console.log(`empleadoController: showEditEmpleadoForm llamado para ID: ${req.params.id}`);
    try {
        const empleados = await readJsonFile(EMPLEADOS_FILE);
        const empleadoIdToEdit = req.params.id;
        // Importante: Asegúrate de que el ID del JSON sea del mismo tipo que req.params.id (string vs number)
        const empleado = empleados.find(emp => String(emp.empleadoID) === String(empleadoIdToEdit));

        if (!empleado) {
            console.warn(`empleadoController: Empleado con ID ${empleadoIdToEdit} no encontrado para edición.`);
            return res.status(404).render('error', { mensaje: 'Empleado no encontrado.' });
        }

        // Renderiza la vista editarEmpleado.pug, pasándole el objeto empleado
        res.render('editarEmpleado', { empleado });
    } catch (error) {
        console.error('empleadoController: Error al mostrar formulario de edición de empleado:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor.' });
    }
};

// 5. Actualizar un empleado existente (POST /cuenta/:id/editar)
export const updateEmpleado = async (req, res) => {
    console.log(`empleadoController: updateEmpleado llamado para ID: ${req.params.id}`);
    try {
        let empleados = await readJsonFile(EMPLEADOS_FILE);
        const empleadoIdToUpdate = req.params.id;
        const { nombre, apellido, dni, correoElectronico, telefono, usuario, contrasena, rol } = req.body;

        const index = empleados.findIndex(emp => String(emp.empleadoID) === String(empleadoIdToUpdate));

        if (index === -1) {
            console.warn(`empleadoController: Empleado con ID ${empleadoIdToUpdate} no encontrado para actualizar.`);
            return res.status(404).render('error', { mensaje: 'Empleado no encontrado para actualizar.' });
        }

        // Actualizar solo los campos que vienen en el body, manteniendo los existentes
        // y manejando la contraseña si se proporciona una nueva
        empleados[index].nombre = nombre;
        empleados[index].apellido = apellido;
        empleados[index].dni = dni;
        empleados[index].correoElectronico = correoElectronico;
        empleados[index].telefono = telefono;
        empleados[index].usuario = usuario;
        // Solo actualiza la contraseña si se envió una nueva
        if (contrasena && contrasena.trim() !== '') {
            empleados[index].contrasena = contrasena; // En un entorno real, hashear la nueva contraseña
        }
        empleados[index].rol = rol;
        // Si hay lógica de foto, iría aquí

        await writeJsonFile(EMPLEADOS_FILE, empleados);

        console.log(`empleadoController: Empleado con ID ${empleadoIdToUpdate} actualizado.`);
        res.redirect('/cuenta'); // Redirige a la lista de empleados después de actualizar
    } catch (error) {
        console.error('empleadoController: Error al actualizar empleado:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor al actualizar el empleado.' });
    }
};

// 6. Eliminar un empleado (DELETE /cuenta/:id/eliminar)
export const deleteEmpleado = async (req, res) => {
    console.log(`empleadoController: deleteEmpleado llamado para ID: ${req.params.id}`);
    try {
        let empleados = await readJsonFile(EMPLEADOS_FILE);
        const empleadoIdToDelete = req.params.id;

        // Filtra el array para excluir el empleado con el ID especificado
        const initialLength = empleados.length;
        empleados = empleados.filter(emp => String(emp.empleadoID) !== String(empleadoIdToDelete));

        if (empleados.length === initialLength) {
            console.warn(`empleadoController: Empleado con ID ${empleadoIdToDelete} no encontrado para eliminar.`);
            return res.status(404).render('error', { mensaje: 'Empleado no encontrado para eliminar.' });
        }

        await writeJsonFile(EMPLEADOS_FILE, empleados);

        console.log(`empleadoController: Empleado con ID ${empleadoIdToDelete} eliminado.`);
        res.redirect('/cuenta'); // Redirige a la lista de empleados después de eliminar
    } catch (error) {
        console.error('empleadoController: Error al eliminar empleado:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor al eliminar el empleado.' });
    }
};