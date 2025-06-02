// src/controllers/usuarioController.js
import Usuario from '../models/Usuario.js'; // Asegurate de importar el modelo
import { leerJSON, escribirJSON } from '../utils/jsonUtils.js';
import { generateUniqueId } from '../utils/idGenerator.js';

const DB_USUARIOS = './data/usuarios.json';


export const renderInicio = (req, res) => {
  res.render('inicio');
};
export const createUsuario = async (req, res) => {
  const { nombre, apellido, usuario, contrasena, rol, subrol, dni, correoElectronico, telefono } = req.body;


  const usuarios = await leerJSON(DB_USUARIOS);

  const nuevoId = usuarios.length > 0
    ? Math.max(...usuarios.map(u => parseInt(u.id || 0))) + 1
    : 1;

  const nuevoUsuario = new Usuario(
  nuevoId,
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


  usuarios.push(nuevoUsuario);
  await escribirJSON(DB_USUARIOS, usuarios);

  res.redirect('/usuario');
};

export const renderLogin = (req, res) => {
  const { rol } = req.query;
  res.render('login', { rol });
};

export const procesarLogin = async (req, res) => {
  const { usuario, contrasena, rol } = req.body;
  const usuarios = await leerJSON(DB_USUARIOS);

  const user = usuarios.find(u =>
    u.usuario === usuario &&
    u.contrasena === contrasena &&
    u.rol === rol
  );

  if (!user) {
    return res.status(401).render('errorLogin', { mensaje: 'Credenciales incorrectas' });
  }

  switch (rol) {
    case 'administrador':
      return res.redirect('/admin');
    case 'empleado':
      return res.redirect(`/empleado/${user.id}/dashboard`);
    case 'propietario':
      return res.redirect(`/propietario/${user.id}/dashboard`);
    case 'inquilino':
      return res.redirect(`/inquilino/${user.id}/dashboard`);
    default:
      return res.redirect('/');
  }
};

export const getAllUsuarios = async (req, res) => {
  const usuarios = await leerJSON(DB_USUARIOS);
  res.render('listaUsuarios', { usuarios }); // Usa la vista correcta
};

export const showNewUsuarioForm = (req, res) => {
  res.render('nuevoUsuario');
};



export const showEditUsuarioForm = async (req, res) => {
  const usuarios = await leerJSON(DB_USUARIOS);
  const usuario = usuarios.find(u => parseInt(u.id) === parseInt(req.params.id));
  if (!usuario) return res.status(404).render('error', { mensaje: 'Usuario no encontrado' });
  res.render('editarUsuario', { usuario });
};

export const updateUsuario = async (req, res) => {
  const usuarios = await leerJSON(DB_USUARIOS);
  const id = parseInt(req.params.id);
  const idx = usuarios.findIndex(u => {
    const uid = u.id !== undefined ? u.id : u.usuarioID;
    return parseInt(uid) === id;
  });


  if (idx === -1) {
    return res.status(404).render('error', { mensaje: 'Usuario no encontrado' });
  }

  const { nombre, apellido, usuario, contrasena, rol, subrol, dni, correoElectronico, telefono } = req.body;
  const foto = req.file ? `/public/uploads/${req.file.filename}` : usuarios[idx].foto;

  usuarios[idx] = {
    ...usuarios[idx],
    nombre: nombre || usuarios[idx].nombre,
    apellido: apellido || usuarios[idx].apellido,
    usuario: usuario || usuarios[idx].usuario,
    contrasena: contrasena || usuarios[idx].contrasena,
    rol: ['administrador', 'empleado', 'propietario', 'inquilino'].includes(rol) ? rol : usuarios[idx].rol,
    subrol: subrol || usuarios[idx].subrol,
    dni: dni || usuarios[idx].dni,
    correoElectronico: correoElectronico || usuarios[idx].correoElectronico,
    telefono: telefono || usuarios[idx].telefono,
    foto: foto
  };

  await escribirJSON(DB_USUARIOS, usuarios);
  res.redirect('/usuario');
};



export const deleteUsuario = async (req, res) => {
  try {
    const usuarios = await leerJSON(DB_USUARIOS);
    const id = parseInt(req.params.id);
    const nuevos = usuarios.filter(u => parseInt(u.id) !== id);

    await escribirJSON(DB_USUARIOS, nuevos);
    console.log(`Usuario con ID ${id} eliminado (o no existía).`);

    res.redirect('/usuario');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).render('error', { mensaje: 'Error interno al eliminar el usuario.' });
  }
};

export const getUsuarioById = async (req, res) => {
  const usuarios = await leerJSON(DB_USUARIOS);
  const usuario = usuarios.find(u => parseInt(u.id) === parseInt(req.params.id));
  if (!usuario) return res.status(404).render('error', { mensaje: 'Usuario no encontrado' });
  res.render('usuarioDetalle', { usuario });
};
