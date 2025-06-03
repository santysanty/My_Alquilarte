// src/controllers/empleadoController.js
import Usuario from '../models/Usuario.js'; // asegúrate de tener esta importación

import Empleado from '../models/Empleado.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonHandler.js';
import { generateUniqueId } from '../utils/idGenerator.js';

const EMPLEADOS_FILE = 'empleados.json';//Base de empleados
const TAREAS_FILE = 'tareas.json';//Base de Tarea


export const getAllEmpleados = async (req, res) => {
    console.log('empleadoController: getAllEmpleados llamado.');
    try {
        const empleados = await readJsonFile(EMPLEADOS_FILE);

        const filtroRol = req.query.filtroRol || '';
        const filtroSubrol = req.query.filtroSubrol || '';
        const busquedaEmpleado = req.query.busquedaEmpleado ? req.query.busquedaEmpleado.toLowerCase() : '';

        let empleadosFiltrados = empleados;

        if (filtroRol) {
            empleadosFiltrados = empleadosFiltrados.filter(
                empleado => empleado.rol && empleado.rol.toLowerCase() === filtroRol.toLowerCase()
            );
        }

        if (filtroSubrol) {
            empleadosFiltrados = empleadosFiltrados.filter(
                empleado => empleado.subrol && empleado.subrol.toLowerCase() === filtroSubrol.toLowerCase()
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

        res.render('listaEmpleados', {
            empleados: empleadosFiltrados,
            filtroRol,
            filtroSubrol,
            busquedaEmpleado
        });
    } catch (error) {
        console.error('empleadoController: Error al obtener empleados:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor al cargar empleados.' });
    }
};

export const showNewEmpleadoForm = (req, res) => {
    console.log('empleadoController: showNewEmpleadoForm llamado.');
    res.render('nuevoEmpleado');
};

export const createEmpleado = async (req, res) => {
  console.log('empleadoController: createEmpleado llamado.');
  try {
    const empleados = await readJsonFile(EMPLEADOS_FILE);
    const { nombre, apellido, dni, correoElectronico, telefono, usuario, contrasena, rol, subrol } = req.body;

    // 1. Primero generamos el ID
    const empleadoID = await generateUniqueId(); 

    // 2. Creamos el nuevo Empleado
    const newEmpleado = new Empleado(
      empleadoID,
      nombre,
      apellido,
      dni,
      correoElectronico,
      telefono,
      usuario,
      contrasena,
      rol,
      subrol,
      req.file ? `/public/uploads/${req.file.filename}` : ''
    );
    empleados.push(newEmpleado);
    await writeJsonFile(EMPLEADOS_FILE, empleados);

    // 3. Registramos también como Usuario
    const usuarios = await readJsonFile('usuarios.json');
    const newUsuario = new Usuario(
      empleadoID,
      nombre,
      apellido,
      dni,
      correoElectronico,
      telefono,
      usuario,
      contrasena,
      rol,
      subrol,
      req.file ? `/public/uploads/${req.file.filename}` : ''
    );
    usuarios.push(newUsuario);
    await writeJsonFile('usuarios.json', usuarios);

    console.log(`Empleado ${nombre} ${apellido} creado con ID: ${empleadoID}`);
    res.redirect('/empleados');
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).render('error', { mensaje: 'Error interno del servidor al crear el empleado.' });
  }
};


export const showEditEmpleadoForm = async (req, res) => {
    console.log(`empleadoController: showEditEmpleadoForm llamado para ID: ${req.params.id}`);
    try {
        const empleados = await readJsonFile(EMPLEADOS_FILE);
        const empleado = empleados.find(emp => String(emp.empleadoID) === String(req.params.id));

        if (!empleado) {
            console.warn(`empleadoController: Empleado con ID ${req.params.id} no encontrado para edición.`);
            return res.status(404).render('error', { mensaje: 'Empleado no encontrado.' });
        }

        res.render('editarEmpleado', { empleado });
    } catch (error) {
        console.error('empleadoController: Error al mostrar formulario de edición de empleado:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor.' });
    }
};

export const updateEmpleado = async (req, res) => {
  console.log(`empleadoController: updateEmpleado llamado para ID: ${req.params.id}`);
  try {
    let empleados = await readJsonFile(EMPLEADOS_FILE);

    if (!Array.isArray(empleados)) {
      console.error('Error: El archivo de empleados no contiene un array válido.');
      return res.status(500).render('error', { mensaje: 'Datos corruptos. No se pudo actualizar.' });
    }

    const index = empleados.findIndex(emp => String(emp.empleadoID) === String(req.params.id));

    if (index === -1) {
      console.warn(`Empleado con ID ${req.params.id} no encontrado para actualizar.`);
      return res.status(404).render('error', { mensaje: 'Empleado no encontrado.' });
    }

    const { nombre, apellido, dni, correoElectronico, telefono, usuario, contrasena, rol, subrol } = req.body;

    empleados[index] = {
      ...empleados[index], 
      nombre,
      apellido,
      dni,
      correoElectronico,
      telefono,
      usuario,
      rol,
      subrol,
      contrasena: contrasena && contrasena.trim() !== '' ? contrasena : empleados[index].contrasena,
      foto: req.file ? `/public/uploads/${req.file.filename}` : empleados[index].foto
    };

    await writeJsonFile(EMPLEADOS_FILE, empleados);
    console.log(`Empleado con ID ${req.params.id} actualizado correctamente.`);
    res.redirect('/empleados');

  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).render('error', { mensaje: 'Error interno del servidor al actualizar el empleado.' });
  }
};


export const deleteEmpleado = async (req, res) => {
    console.log(`empleadoController: deleteEmpleado llamado para ID: ${req.params.id}`);
    try {
        let empleados = await readJsonFile(EMPLEADOS_FILE);
        const initialLength = empleados.length;
        empleados = empleados.filter(emp => String(emp.empleadoID) !== String(req.params.id));

        if (empleados.length === initialLength) {
            console.warn(`empleadoController: Empleado con ID ${req.params.id} no encontrado para eliminar.`);
            return res.status(404).render('error', { mensaje: 'Empleado no encontrado para eliminar.' });
        }

        await writeJsonFile(EMPLEADOS_FILE, empleados);

        console.log(`empleadoController: Empleado con ID ${req.params.id} eliminado.`);
        res.redirect('/empleados');
    } catch (error) {
        console.error('empleadoController: Error al eliminar empleado:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor al eliminar el empleado.' });
    }
};

export const showEmpleadoDetail = async (req, res) => {
    try {
        const empleados = await readJsonFile(EMPLEADOS_FILE);
        const tareas = await readJsonFile(TAREAS_FILE);

        const id = parseInt(req.params.id);
        const empleado = empleados.find(e => String(e.empleadoID) === String(req.params.id));

        if (!empleado) return res.status(404).render('error', { mensaje: 'Empleado no encontrado' });

        const tareasAsignadas = tareas.filter(t => t.empleadoId === id);

        res.render('detalleEmpleado', { empleado, tareas: tareasAsignadas });
    } catch (error) {
        console.error('Error al mostrar detalle del empleado:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor al mostrar detalle del empleado.' });
    }
};

