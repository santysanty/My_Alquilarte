// src/controllers/authController.js

import { readJsonFile } from '../utils/jsonHandler.js'; // Importa tus funciones de manejo de JSON
import path from 'path'; // Para construir la ruta absoluta al JSON
import { fileURLToPath } from 'url'; // Para __dirname en ES Modules

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define la ruta a tu archivo de usuarios.json de forma robusta
const DB_USUARIOS = path.join(__dirname, '..', '..', 'data', 'usuarios.json'); 
// La ruta '../data/usuarios.json' sería relativa a este archivo. 
// path.join(__dirname, '..', '..', 'data', 'usuarios.json') asegura que siempre apunte a data/usuarios.json desde la raíz del proyecto.


// Función para renderizar la vista de login
export const renderLogin = (req, res) => {
    res.render('login'); // Asegúrate de tener 'login.pug' en tu carpeta views
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
            // Asegúrate de tener 'errorLogin.pug' en tu carpeta views
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

// Puedes añadir otras funciones relacionadas con la autenticación aquí si las necesitas
// Por ejemplo:
// export const logout = (req, res) => {
//     // Lógica para cerrar sesión (para futura entrega con sesiones)
//     res.redirect('/login');
// };