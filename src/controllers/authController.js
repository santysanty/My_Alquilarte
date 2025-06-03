// src/controllers/authController.js

import { readJsonFile } from '../utils/jsonHandler.js'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define la ruta a tu archivo de usuarios.json de forma robusta
const DB_USUARIOS = path.join(__dirname, '..', '..', 'data', 'usuarios.json'); 


// Función para renderizar la vista de login
export const renderLogin = (req, res) => {
    res.render('login'); 
};

// Función para procesar el intento de login
export const processLogin = async (req, res) => {
    const { usuario, contrasena } = req.body; // Obtiene el usuario y la contraseña del formulario

    try {
        const usuarios = await readJsonFile(DB_USUARIOS); // Lee los usuarios del archivo JSON
        const encontrado = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

        if (!encontrado) {
            // Si no se encuentra el usuario o las credenciales son incorrectas
            return res.status(401).render('errorLogin', { mensaje: 'Credenciales incorrectas. Inténtalo de nuevo.' });
            
        }

        // Si las credenciales son correctas, redirige según el rol
        switch (encontrado.rol) {
            case 'administrador': 
                console.log('Login exitoso: Administrador');
                return res.redirect('/admin'); // Redirige al dashboard de administrador
            case 'empleado': 
                console.log('Login exitoso: Empleado');
                return res.redirect('/empleado'); // Redirige al dashboard de empleado
            case 'propietario': 
                console.log('Login exitoso: Propietario');
                return res.redirect('/propietario'); // Redirige al dashboard de propietario
            case 'inquilino': 
                console.log('Login exitoso: Inquilino');
                return res.redirect('/inquilino'); // Redirige al dashboard de inquilino
            default: 
                console.log('Login exitoso: Rol desconocido, redirigiendo a inicio');
                return res.redirect('/'); // Redirige a la página de inicio por defecto
        }
    } catch (error) {
        console.error('Error al procesar el login:', error);
        return res.status(500).render('error', { mensaje: 'Ocurrió un error en el servidor al intentar iniciar sesión.' });
    }
};

