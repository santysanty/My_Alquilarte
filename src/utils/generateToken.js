// src/utils/generateToken.js

import jwt from 'jsonwebtoken';

// Se agrega 'res' como el primer parámetro para poder establecer la cookie dentro de esta función.
const generateToken = (res, userId, role, userFunction = null) => {
    // El payload del token DEBE CONTENER SOLO DATOS PLANOS (string, number, boolean, null, object plano).
    // NO pases objetos de Express como 'req' o 'res' aquí.
    const payload = {
        usuario: { // Mantener la estructura 'usuario' para compatibilidad con tu middleware 'protect'
            id: userId,
            role: role,
            function: userFunction
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h', // '1h' es una buena práctica para tokens de sesión. Puedes usar '1d' si lo prefieres.
    });

    // Establecer la cookie HTTP-only en la respuesta
    res.cookie('token', token, {
        httpOnly: true, // La cookie solo es accesible por el servidor (seguridad)
        secure: process.env.NODE_ENV === 'production', // true en producción para HTTPS
        sameSite: 'Lax', // Previene ataques CSRF en cierta medida.
        maxAge: 3600000 // 1 hora en milisegundos (coincide con expiresIn: '1h')
    });

    console.log('[generateToken] Token generado y cookie establecida.');
    return token; // Retorna el token por si lo necesitas en la respuesta JSON del controlador
};

export default generateToken;