// src/controllers/authController.js

import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail, { sendVerificationEmail } from '../utils/email.js';
import generateToken from '../utils/generateToken.js'; // Asegúrate de que este archivo exista con la firma correcta (res, userId, userRole, userFunction)

// ===============================
// REGISTRO DE USUARIO
// ===============================
export const registerUser = async (req, res, next) => {
    const { username, email, password, role } = req.body;

    try {
        // Validación básica de campos obligatorios
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Todos los campos básicos son obligatorios.' });
        }

        // Validación de longitud de contraseña (ej. desde el frontend ya validaste, pero backend es la última línea)
        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        // Verificar si el usuario o email ya existen
        const existingUser = await Usuario.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario o el email ya están registrados.' });
        }

        // =========================================================================
        // Control de Asignación de Rol (CRÍTICO para la seguridad del Admin)
        // =========================================================================
        const allowedRoles = ['inquilino', 'propietario', 'empleado']; // Roles permitidos para el registro público
        let finalRole = role;

        if (!allowedRoles.includes(role)) {
            // Si el rol enviado no es uno de los permitidos, asigna un rol por defecto seguro
            console.warn(`Intento de registro con rol no permitido: ${role}. Asignando rol por defecto 'inquilino'.`);
            finalRole = 'inquilino'; // O el rol por defecto que desees
            // Si prefieres que sea un error:
            // return res.status(400).json({ message: 'Rol de usuario inválido.' });
        }

        // Asegúrate de que el rol 'admin' NUNCA se pueda asignar por este formulario
        if (finalRole === 'admin') {
            return res.status(403).json({ message: 'No se puede registrar como administrador a través de esta vía.' });
        }
        // =========================================================================

        const newUser = new Usuario({
            username,
            email,
            password, // Mongoose pre-save hook se encargará de hashearla
            role: finalRole, // Asigna el rol validado
            isVerified: false,
            verificationCode: crypto.randomBytes(20).toString('hex'), // Generar código aquí
            verificationCodeExpires: Date.now() + 3600000 // 1 hora de validez
        });

        await newUser.save(); // Guarda el usuario con el código y expiración

        // Enviar email de verificación
        await sendVerificationEmail(newUser.email, newUser.username, newUser.verificationCode);

        // La respuesta 202 (Accepted) es buena para indicar que el proceso continúa (ej. verificación por email)
        res.status(202).json({
            message: 'Registro exitoso. Verifica tu cuenta desde el email enviado.',
            email: newUser.email,
            redirectToLogin: true // Esto puede ser útil para el frontend
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        // Manejo de errores más específico si es un error de validación de Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};

// ===============================
// VERIFICACIÓN DE EMAIL (GET - Enlace)
// ===============================
export const verifyEmail = async (req, res, next) => {
    const { email, code } = req.query;

    try {
        if (!email || !code) {
            return res.status(400).render('auth/verifyError', {
                title: 'Error de Verificación',
                message: 'Enlace inválido. Faltan parámetros.'
            });
        }

        // Asegúrate de seleccionar los campos necesarios para la verificación
        const user = await Usuario.findOne({ email }).select('+verificationCode +verificationCodeExpires +isVerified');
        if (!user) {
            return res.status(400).render('auth/verifyError', {
                title: 'Error de Verificación',
                message: 'Usuario no encontrado.'
            });
        }

        if (user.isVerified) {
            return res.status(200).render('auth/alreadyVerified', {
                title: 'Cuenta ya verificada',
                message: 'Tu cuenta ya ha sido verificada. Puedes iniciar sesión.'
            });
        }

        if (String(user.verificationCode) !== String(code)) {
            return res.status(400).render('auth/verifyError', {
                title: 'Error de Verificación',
                message: 'Código de verificación incorrecto.'
            });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).render('auth/verifyError', {
                title: 'Error de Verificación',
                message: 'El código ha expirado. Por favor, solicita uno nuevo en el login.'
            });
        }

        // Marcar como verificado y limpiar campos de verificación
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Generar token y establecer cookie directamente después de la verificación exitosa
        generateToken(res, user._id, user.role, user.function); // La cookie se setea dentro de generateToken.

        // Redirigir al usuario al flujo de completado de perfil
        return res.redirect('/complete-profile'); // O a tu dashboard si no hay profile completion

    } catch (error) {
        console.error('Error al verificar email por enlace:', error);
        res.status(500).render('auth/verifyError', {
            title: 'Error de Verificación',
            message: 'Error interno del servidor al verificar el email.',
            errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ===============================
// VERIFICACIÓN DE CÓDIGO (POST - desde formulario)
// ===============================
export const verifyCodePost = async (req, res, next) => {
    const { email, code } = req.body;

    try {
        if (!email || !code) {
            // Adaptado para responder JSON o renderizar, dependiendo del encabezado Accept
            const isApiRequest = req.headers.accept?.includes('application/json');
            return isApiRequest
                ? res.status(400).json({ message: 'Email y código son requeridos.' })
                : res.status(400).render('auth/verifyError', { title: 'Error', message: 'Email y código son requeridos.' });
        }

        const user = await Usuario.findOne({ email }).select('+verificationCode +verificationCodeExpires +isVerified');

        if (!user) {
            const isApiRequest = req.headers.accept?.includes('application/json');
            return isApiRequest
                ? res.status(400).json({ message: 'Usuario no encontrado.' })
                : res.status(400).render('auth/verifyError', { title: 'Error', message: 'Usuario no encontrado.' });
        }

        if (user.isVerified) {
            // Si ya está verificado, asegúrate de que la cookie esté presente y redirige
            generateToken(res, user._id, user.role, user.function);
            const isApiRequest = req.headers.accept?.includes('application/json');
            return isApiRequest
                ? res.status(200).json({ message: 'Cuenta ya verificada.', redirectTo: '/complete-profile' })
                : res.redirect('/complete-profile');
        }

        if (String(user.verificationCode) !== String(code)) {
            const isApiRequest = req.headers.accept?.includes('application/json');
            return isApiRequest
                ? res.status(400).json({ message: 'Código de verificación incorrecto.' })
                : res.status(400).render('auth/verifyError', { title: 'Error', message: 'Código de verificación incorrecto.' });
        }

        if (user.verificationCodeExpires < Date.now()) {
            const isApiRequest = req.headers.accept?.includes('application/json');
            return isApiRequest
                ? res.status(400).json({ message: 'El código ha expirado. Por favor, solicita uno nuevo.' })
                : res.status(400).render('auth/verifyError', { title: 'Error', message: 'El código ha expirado.' });
        }

        // Marcar como verificado y limpiar campos de verificación
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Generar token y establecer cookie
        generateToken(res, user._id, user.role, user.function);

        const isApiRequest = req.headers.accept?.includes('application/json');
        return isApiRequest
            ? res.status(200).json({ message: 'Código verificado exitosamente.', redirectTo: '/complete-profile' })
            : res.redirect('/complete-profile');

    } catch (error) {
        console.error('Error al verificar código de email (POST):', error);
        const isApiRequest = req.headers.accept?.includes('application/json');
        return isApiRequest
            ? res.status(500).json({ message: 'Error interno del servidor al verificar el código.' })
            : res.status(500).render('auth/verifyError', {
                title: 'Error',
                message: 'Error interno del servidor al verificar el código.',
                errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
    }
};

// ===============================
// INICIO DE SESIÓN (LOGIN) - CORREGIDA
// ===============================
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            // Siempre responde JSON para esta API. El frontend manejará la visualización.
            return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
        }

        const user = await Usuario.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        if (!user.isVerified) {
            const verificationRedirectUrl = `/verify-code?email=${encodeURIComponent(user.email)}`;
            return res.status(401).json({
                message: 'Cuenta no verificada. Por favor, verifica tu email.',
                needsVerification: true,
                email: user.email,
                redirectTo: verificationRedirectUrl // El frontend usará esto para redirigir
            });
        }

        // Generar token y establecer cookie.
        generateToken(res, user._id, user.role, user.function); // La cookie ya se setea dentro de generateToken.

        // Lógica de Redirección basada en el rol
        let redirectTo;
        switch (user.role) {
            case 'admin':
                redirectTo = '/admin/dashboard';
                break;
            case 'empleado':
                redirectTo = '/empleado/dashboard';
                break;
            case 'propietario':
                redirectTo = '/propietario/dashboard';
                break;
            case 'inquilino':
                redirectTo = '/inquilino/dashboard';
                break;
            default:
                redirectTo = '/dashboard';
                break;
        }

        // Siempre responde con JSON con la URL de redirección.
        // El frontend (`login.js`) será el encargado de la redirección.
        res.status(200).json({
            message: 'Login exitoso.',
            role: user.role,
            username: user.username,
            email: user.email,
            function: user.function || null,
            isVerified: user.isVerified,
            personalData: user.personalData || {},
            redirectTo: redirectTo // El frontend usará esta URL
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // En caso de error general, siempre responde JSON.
        return res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};

// ===============================
// CIERRE DE SESIÓN
// ===============================
export const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Expira inmediatamente
        secure: process.env.NODE_ENV === 'production', // Solo si estás en producción y usas HTTPS
        sameSite: 'Lax', // O 'Strict' si es más apropiado para tu caso
    });
    res.status(200).json({ message: 'Sesión cerrada.' }); // Podrías redirigir a /login en el frontend después de esta respuesta
};

// ===============================
// REENVIAR CÓDIGO DE VERIFICACIÓN
// ===============================
export const resendVerificationCode = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await Usuario.findOne({ email }).select('+verificationCode +verificationCodeExpires +isVerified');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        if (user.isVerified) return res.status(400).json({ message: 'La cuenta ya está verificada.' });

        const newCode = crypto.randomBytes(20).toString('hex'); // Genera un nuevo código
        user.verificationCode = newCode; // Actualiza el código en el usuario
        user.verificationCodeExpires = Date.now() + 3600000; // Actualiza la expiración
        await user.save();
        
        await sendVerificationEmail(user.email, user.username, newCode);

        res.status(200).json({ message: 'Nuevo código de verificación enviado al email.' });

    } catch (error) {
        console.error('Error al reenviar código:', error);
        res.status(500).json({ message: 'Error al reenviar código.' });
    }
};

// ===============================
// OBTENER PERFIL DE USUARIO
// ===============================
export const getProfile = async (req, res, next) => {
    try {
        // req.user._id viene del middleware de autenticación (protect)
        const user = await Usuario.findById(req.user._id).select('-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordExpire');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            function: user.function || null,
            isVerified: user.isVerified,
            personalData: user.personalData || {}
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error al obtener perfil.' });
    }
};

// ===============================
// ACTUALIZAR PERFIL DE USUARIO
// ===============================
export const updateProfile = async (req, res, next) => {
    try {
        const user = await Usuario.findById(req.user._id); // req.user._id viene del middleware de autenticación
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        // **IMPORTANTE**: No permitir que un usuario cambie su propio rol a 'admin' o a otros roles sin control
        // Si el rol viene en el body, sólo permitirlo si es uno de los roles permitidos o si el usuario es admin
        if (req.body.role && user.role !== 'admin') { // Solo el admin puede cambiar su rol o el de otros
            const allowedUpdateRoles = ['inquilino', 'propietario', 'empleado'];
            if (allowedUpdateRoles.includes(req.body.role)) {
                user.role = req.body.role;
            } else {
                return res.status(400).json({ message: 'No tienes permiso para asignar ese rol o el rol es inválido.' });
            }
        } else if (req.body.role && user.role === 'admin') {
            // Si el admin está actualizando su propio perfil o el de otro, puede cambiar el rol
            user.role = req.body.role; // Un admin puede asignarse cualquier rol o cambiar el rol de otros
        }


        if (req.body.function !== undefined) {
            // La función solo aplica si el rol es 'empleado'. Si el rol cambia, la función podría resetearse.
            user.function = (user.role === 'empleado' && req.body.function) ? req.body.function : null;
        }


        // Inicializar personalData si es null/undefined
        if (!user.personalData) user.personalData = {};

        user.personalData.firstName = req.body.firstName || user.personalData.firstName;
        user.personalData.lastName = req.body.lastName || user.personalData.lastName;
        user.personalData.dni = req.body.dni || user.personalData.dni;
        user.personalData.phone = req.body.phone || user.personalData.phone;
        user.personalData.address = req.body.address || user.personalData.address;

        if (req.body.password) {
            // Asegúrate de que el modelo Usuario tenga un pre-save hook para hashear la contraseña
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        // Determinar la redirección para la respuesta JSON
        let redirectTo;
        switch (updatedUser.role) {
            case 'admin':
                redirectTo = '/admin/dashboard'; // Tu panel de administración principal
                break;
            case 'empleado':
                redirectTo = '/empleado/dashboard';
                break;
            case 'propietario':
                redirectTo = '/propietario/dashboard';
                break;
            case 'inquilino':
                redirectTo = '/inquilino/dashboard';
                break;
            default:
                redirectTo = '/dashboard'; // Un dashboard por defecto
                break;
        }

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            function: updatedUser.function || null,
            isVerified: updatedUser.isVerified,
            personalData: updatedUser.personalData,
            message: 'Perfil actualizado exitosamente.',
            redirectTo: redirectTo // Envía la URL de redirección
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        // Manejo de errores más específico si es un error de validación de Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar perfil.' });
    }
};

// ===============================
// RECUPERACIÓN DE CONTRASEÑA (Solicitud)
// ===============================
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await Usuario.findOne({ email }).select('+resetPasswordToken +resetPasswordExpire');
        if (!user) {
            // Evitar enumeración de usuarios: siempre dar la misma respuesta si el email existe o no
            return res.status(200).json({ message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hora de validez
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const emailHtml = `
            <p>Hola ${user.username || 'Usuario'},</p>
            <p>Has solicitado restablecer tu contraseña para Alquilarte.</p>
            <p>Haz clic en este enlace: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>Este enlace es válido por 1 hora.</p>
            <p>Si no solicitaste un restablecimiento de contraseña, puedes ignorar este mensaje.</p>
            <p>Saludos,<br>El equipo de Alquilarte</p>
        `;
        await sendEmail(user.email, 'Restablecimiento de contraseña para Alquilarte', emailHtml);
        res.status(200).json({ message: 'Email de restablecimiento enviado.' });

    } catch (error) {
        console.error('Error al procesar restablecimiento de contraseña:', error);
        // Limpiar el token de reset si hubo un error después de generarlo pero antes de enviar email
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
        }
        res.status(500).json({ message: 'Error al procesar la solicitud de restablecimiento de contraseña.' });
    }
};

// ===============================
// RESTABLECER CONTRASEÑA (Confirmación)
// ===============================
export const resetPassword = async (req, res, next) => {
    const resetPasswordTokenHashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const { password } = req.body;

    // Validación de la nueva contraseña
    if (!password || password.length < 6) {
        const isApiRequest = req.headers.accept?.includes('application/json');
        return isApiRequest
            ? res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' })
            : res.redirect('/login?resetError=password_length'); // Redirigir para vistas
    }

    try {
        const user = await Usuario.findOne({
            resetPasswordToken: resetPasswordTokenHashed,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpire');

        if (!user) {
            const isApiRequest = req.headers.accept?.includes('application/json');
            return isApiRequest
                ? res.status(400).json({ message: 'Token de restablecimiento inválido o expirado.' })
                : res.redirect('/login?resetError=invalid_token');
        }

        user.password = password; // El pre-save hook del modelo hasheará esto
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.isVerified = true; // Es una buena práctica verificar la cuenta si se restablece la contraseña
        await user.save();

        const isApiRequest = req.headers.accept?.includes('application/json');
        return isApiRequest
            ? res.status(200).json({ message: 'Contraseña restablecida exitosamente.', redirectTo: '/login' })
            : res.redirect('/login?resetSuccess=true');

    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        const isApiRequest = req.headers.accept?.includes('application/json');
        return isApiRequest
            ? res.status(500).json({ message: 'Error interno del servidor al restablecer la contraseña.' })
            : res.status(500).redirect('/login?resetError=server_error');
    }
};