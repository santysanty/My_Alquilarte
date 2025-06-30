// src/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

/**
 * Función auxiliar para decidir si responder con JSON o redirigir.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {number} statusCode - Código de estado HTTP.
 * @param {string} jsonMessage - Mensaje para la respuesta JSON.
 * @param {string} redirectUrl - URL a la que redirigir si no es una solicitud de API.
 * @param {object} renderOptions - Opciones para res.render si no es una solicitud de API (ej. { title: 'Error', message: '...' }).
 * @param {boolean} clearCookie - Si se debe limpiar la cookie 'token'.
 */
const respondWithError = (res, statusCode, jsonMessage, redirectUrl, renderOptions = {}, clearCookie = false) => {
    if (clearCookie) {
        res.clearCookie('token');
    }

    // Priorizamos la detección de API por el prefijo de la URL o el header Accept
    if (res.req.originalUrl.startsWith('/api/') || res.req.headers.accept?.includes('application/json')) {
        return res.status(statusCode).json({ message: jsonMessage });
    } else {
        // Redirección si la URL está definida, de lo contrario renderiza la vista de error
        if (redirectUrl) {
            return res.redirect(redirectUrl);
        } else {
            return res.status(statusCode).render('error', renderOptions);
        }
    }
};


/**
 * Middleware para proteger rutas, verificar token JWT y el estado de verificación del usuario.
 */
export const protect = async (req, res, next) => {
    console.log('[authMiddleware:protect] Iniciando middleware protect.');
    let token;

    // 1. Buscar token en cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('[authMiddleware:protect] Token encontrado en cookies.');
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('[authMiddleware:protect] Token encontrado en encabezado Authorization.');
    }

    // 2. Si no hay token, denegar acceso
    if (!token) {
        console.log('[authMiddleware:protect] Error: No se encontró token, acceso no autorizado.');
        return respondWithError(
            res,
            401,
            'No autorizado, no hay token.',
            '/login?error=no_auth_token',
            { title: 'No Autorizado', message: 'No se encontró tu token de sesión. Por favor, inicia sesión.' },
            true // Limpiar cookie
        );
    }

    try {
        // 3. Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Asumiendo que 'decoded.usuario.id' es la estructura.
        // Si tu token solo contiene el ID directamente, sería 'decoded.id'.
        // Verifica tu `generateToken` para saber la estructura.
        const userId = decoded.usuario?.id || decoded.id; // Flexibilidad para el ID
        console.log('[authMiddleware:protect] Token verificado. Decodificado ID:', userId);

        if (!userId) {
            console.log('[authMiddleware:protect] Error: El token no contiene un ID válido.');
            return respondWithError(
                res,
                401,
                'Token inválido: ID de usuario faltante.',
                '/login?error=invalid_token_payload',
                { title: 'Error de Sesión', message: 'El token de sesión es inválido.' },
                true // Limpiar cookie
            );
        }

        // 4. Buscar usuario
        req.user = await Usuario.findById(userId).select('-password');

        if (!req.user) {
            console.log('[authMiddleware:protect] Error: Usuario no encontrado para el token.');
            return respondWithError(
                res,
                401,
                'No autorizado, usuario no encontrado.',
                '/login?error=invalid_user_token',
                { title: 'No Autorizado', message: 'El usuario asociado a tu sesión no fue encontrado.' },
                true // Limpiar cookie
            );
        }

        // 5. Verificar si está verificado
        if (!req.user.isVerified) {
            console.log('[authMiddleware:protect] Acceso denegado: Usuario no verificado.');
            return respondWithError(
                res,
                403,
                'Cuenta no verificada. Por favor, verifica tu email.',
                `/login?error=unverified_account&email=${encodeURIComponent(req.user.email)}`,
                { title: 'Acceso Denegado', message: 'Tu cuenta no ha sido verificada. Por favor, verifica tu email.' },
                true // Limpiar cookie
            );
        }

        console.log(`[authMiddleware:protect] Usuario autenticado y verificado: ${req.user.username} - Rol: ${req.user.role}`);
        next();

    } catch (error) {
        console.error('[authMiddleware:protect] Error al verificar token:', error.message);
        return respondWithError(
            res,
            401,
            'Token inválido o expirado.',
            '/login?error=token_expired',
            { title: 'Sesión Expirada', message: 'Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.' },
            true // Limpiar cookie
        );
    }
};

/**
 * Middleware para autorizar roles.
 */
export const authorize = (roles = []) => (req, res, next) => {
    if (typeof roles === 'string') roles = [roles];
    console.log(`[authMiddleware:authorize] Verificando rol: ${req.user?.role}. Roles permitidos: ${roles.join(', ')}`);

    if (!req.user || !roles.includes(req.user.role)) {
        console.log('[authMiddleware:authorize] Acceso denegado por rol.');
        return respondWithError(
            res,
            403,
            'Acceso denegado por rol.',
            null, // No hay redirección específica para este error de rol, se renderiza la vista
            { title: 'Acceso Denegado', message: `No tienes permisos para acceder. Tu rol es: ${req.user?.role || 'N/A'}.` }
        );
    }

    console.log('[authMiddleware:authorize] Rol permitido. Continuando.');
    next();
};