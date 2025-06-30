// src/config/passport.js
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Usuario from '../models/Usuario.js'; // Importa tu modelo de Usuario
import dotenv from 'dotenv'; // Asegúrate de que dotenv esté importado

dotenv.config(); // Carga las variables de entorno para usar process.env.JWT_SECRET

const configurePassport = (passport) => {
    const opts = {};
    // Indica a Passport que extraiga el JWT del encabezado de autorización
    // que se ve así: Authorization: Bearer <tu_token_jwt>
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // Este es el secreto usado para firmar y verificar el token. Debe ser el mismo que usaste en authController.js y en tu .env
    opts.secretOrKey = process.env.JWT_SECRET; // Asegúrate de que JWT_SECRET esté definido en tu archivo .env

    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                // El 'jwt_payload' contiene la información que pusiste en el token,
                // en nuestro caso, el ID del usuario ({ id: user._id })
                const user = await Usuario.findById(jwt_payload.id);

                if (user) {
                    // Si el usuario se encuentra, la autenticación es exitosa.
                    // 'done(null, user)' pasa el objeto 'user' a 'req.user' en tus rutas protegidas.
                    return done(null, user);
                } else {
                    // Si el usuario no existe en la base de datos (quizás fue eliminado),
                    // la autenticación falla.
                    return done(null, false);
                }
            } catch (error) {
                // Manejo de errores que puedan ocurrir durante la consulta a la base de datos
                return done(error, false);
            }
        })
    );

    // Estas funciones son necesarias para Passport, incluso si estás usando JWT
    // (que es principalmente stateless). Express-session las usa para mantener
    // la información del usuario en la sesión.
    passport.serializeUser((user, done) => {
        done(null, user.id); // Almacena solo el ID del usuario en la sesión
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Usuario.findById(id);
            done(null, user); // Recupera el usuario completo de la DB usando el ID de la sesión
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;