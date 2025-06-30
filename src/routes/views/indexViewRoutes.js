// src/routes/indexRoutes.js
import express from 'express';
import { protect, authorize } from '../../middlewares/authMiddleware.js';
import Usuario from '../../models/Usuario.js';
import Departamento from '../../models/Departamento.js';

const router = express.Router();

// ===============================
// VISTAS AUTENTICACIÓN
// ===============================

router.get('/', (req, res) => {
  console.log('[INDEX_ROUTES] Redirigiendo a /login');
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Iniciar Sesión' });
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Registrarse' });
});

router.get('/verify-code', (req, res) => {
  const email = req.query.email || '';
  res.render('auth/verifyCode', { title: 'Verificar Código', email });
});

router.get('/forgot-password', (req, res) => {
  res.render('auth/forgotPassword', { title: 'Restablecer Contraseña' });
});

router.get('/reset-password/:token', (req, res) => {
  res.render('auth/resetPassword', { title: 'Nueva Contraseña', token: req.params.token });
});

router.get('/complete-profile', protect, (req, res) => {
  res.render('auth/completeProfile', { title: 'Completa tu Perfil', user: req.user });
});

// ===============================
// DASHBOARDS POR ROL
// ===============================

router.get('/admin/dashboard', protect, authorize(['admin']), async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id).select('-password');
    if (!user) return res.status(404).render('error', { message: 'Usuario no encontrado.' });

    res.render('admin/adminDashboard', { title: 'Panel Administrador', user });
  } catch (error) {
    console.error('Error al renderizar /admin/dashboard:', error);
    res.status(500).render('error', { message: 'Error interno del servidor.' });
  }
});

router.get('/empleado/dashboard', protect, authorize(['empleado']), (req, res) => {
  res.render('empleados/empleadoDashboard', { title: 'Panel Empleado', user: req.user });
});

router.get('/propietario/dashboard', protect, authorize(['propietario']), (req, res) => {
  res.render('propietarios/propietarioDashboard', { title: 'Panel Propietario', user: req.user });
});

router.get('/inquilino/dashboard', protect, authorize(['inquilino']), (req, res) => {
  res.render('inquilinos/inquilinoDashboard', { title: 'Panel Inquilino', user: req.user });
});

// ===============================
// GESTIÓN DE DEPARTAMENTOS
// ===============================

router.get('/admin/departamento', protect, authorize(['admin']), async (req, res) => {
  try {
    const departamentos = await Departamento.find().lean();
    res.render('admin/departamento', { title: 'Gestión de Departamentos', departamentos });
  } catch (error) {
    console.error('Error al cargar departamentos:', error);
    res.render('admin/departamento', { title: 'Gestión de Departamentos', departamentos: [] });
  }
});

// ===============================
// VISTA DEMO DE PROPIEDADES
// ===============================

router.get('/admin/demo-properties', protect, authorize(['admin']), (req, res) => {
  res.render('admin/demo-properties-list', {
    title: 'Listado de Propiedades',
    isLoggedIn: !!req.user
  });
});

// ===============================
// LOGOUT
// ===============================

router.get('/logout', (req, res) => {
  res.render('auth/logout', { title: 'Cerrar Sesión' });
});

export default router;
