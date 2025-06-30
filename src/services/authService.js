// src/routes/authRoutes.js (VERSIÓN CORREGIDA Y FINAL)

import express from 'express';
// Importa las funciones del controlador de autenticación
// Asegúrate de que `updateProfile` esté importado, ya que lo usaremos para complete-profile
import { registerUser, loginUser, verifyEmail, resendVerificationCode, getProfile, updateProfile, logoutUser, forgotPassword, resetPassword } from '../controllers/authController.js';
// Importa el middleware de protección de rutas
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas de autenticación públicas
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail); // Ruta para verificar email
router.post('/resend-code', resendVerificationCode); // Ruta para reenviar código
router.post('/forgot-password', forgotPassword); // Ruta para solicitar restablecimiento
router.put('/reset-password/:token', resetPassword); // Ruta para restablecer contraseña

// Ruta para COMPLETAR EL PERFIL (usa updateProfile, ya que está diseñado para actualizar)
// Se invoca después de la verificación del email para añadir los datos personales iniciales
router.post('/complete-profile', protect, updateProfile); // <-- ¡¡¡ESTA ES LA LÍNEA QUE FALTABA!!!

// Rutas de perfil protegidas (existentes, para GET y PUT generales de perfil)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile); // Esta ruta sigue siendo útil para actualizaciones posteriores

// Ruta de logout
router.post('/logout', logoutUser);

export default router;