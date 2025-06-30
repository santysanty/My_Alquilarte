// src/routes/authRoutes.js

import express from 'express';
import {
  registerUser,
  verifyEmail,
  verifyCodePost,
  loginUser,
  logoutUser,
  resendVerificationCode,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

import { protect } from '../middlewares/authMiddleware.js'; // <-- ¡IMPORTAR EL MIDDLEWARE PROTECT!

const router = express.Router();

router.post('/register', (req, res, next) => {
  console.log('[RUTA] POST /register - req.body:', req.body);
  registerUser(req, res, next);
});

router.get('/verify-email', (req, res, next) => {
  console.log('[RUTA] GET /verify-email - req.query:', req.query);
  verifyEmail(req, res, next);
});

router.post('/verify-code', (req, res, next) => {
  console.log('[RUTA] POST /verify-code - req.body:', req.body);
  verifyCodePost(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('[RUTA] POST /login - req.body:', req.body);
  loginUser(req, res, next);
});

router.post('/logout', (req, res) => {
  console.log('[RUTA] POST /logout');
  logoutUser(req, res);
});

router.post('/resend-verification-code', (req, res, next) => {
  console.log('[RUTA] POST /resend-verification-code - req.body:', req.body);
  resendVerificationCode(req, res, next);
});

// ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE! APLICAR 'protect'
router.get('/profile', protect, (req, res, next) => { // <-- Se añadió 'protect'
  console.log('[RUTA] GET /profile');
  getProfile(req, res, next);
});

// ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE! APLICAR 'protect'
router.put('/profile', protect, (req, res, next) => { // <-- Se añadió 'protect'
  console.log('[RUTA] PUT /profile - req.body:', req.body);
  updateProfile(req, res, next);
});

router.post('/forgot-password', (req, res, next) => {
  console.log('[RUTA] POST /forgot-password - req.body:', req.body);
  forgotPassword(req, res, next);
});

router.post('/reset-password/:token', (req, res, next) => {
  console.log('[RUTA] POST /reset-password/:token - token:', req.params.token, 'body:', req.body);
  resetPassword(req, res, next);
});

export default router;