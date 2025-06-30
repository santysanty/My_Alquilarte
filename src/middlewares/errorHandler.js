// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Determina el código de estado HTTP. Si la respuesta ya tiene un estado (ej. 401 de auth), úsalo.
    // Si el estado es 200 (OK) por defecto, significa que el error ocurrió antes de que se estableciera un estado de error,
    // así que lo cambiamos a 500 (Internal Server Error).
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Envía una respuesta JSON con el mensaje de error y, en desarrollo, el stack trace.
    res.json({
        message: err.message,
        // El stack trace solo se envía en modo de desarrollo para facilitar la depuración.
        // En producción, es mejor no exponer detalles internos del servidor.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;