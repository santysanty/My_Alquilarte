import { readJsonFile } from '../utils/jsonHandler.js'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_USUARIOS = path.join(__dirname, '..', '..', 'data', 'usuarios.json'); 
const DB_EMPLEADOS = path.join(__dirname, '..', '..', 'data', 'empleados.json'); 


export const renderLogin = (req, res) => {
    res.render('login'); 
};

export const processLogin = async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const usuarios = await readJsonFile(DB_USUARIOS);
        const empleados = await readJsonFile(DB_EMPLEADOS);

        // Buscar primero en usuarios.json
        let personaEncontrada = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

        // Si no está en usuarios.json, buscar en empleados.json
        if (!personaEncontrada) {
            personaEncontrada = empleados.find(e => e.usuario === usuario && e.contrasena === contrasena);
        }

        if (!personaEncontrada) {
            return res.status(401).render('errorLogin', { mensaje: 'Credenciales incorrectas. Inténtalo de nuevo.' });
        }

        // Redirigir según el rol
        const rol = personaEncontrada.rol?.toLowerCase();

        switch (rol) {
            case 'administrador':
                console.log('Login exitoso: Administrador');
                return res.redirect('/admin');
            case 'empleado':
                console.log('Login exitoso: Empleado');
                console.log('Redirigiendo a: /empleados/' + (personaEncontrada.id || personaEncontrada.empleadoID) + '/dashboard');
                return res.redirect(`/empleados/${personaEncontrada.id || personaEncontrada.empleadoID}/dashboard`);
            case 'propietario':
                console.log('Login exitoso: Propietario');
                return res.redirect(`/propietario/${personaEncontrada.id}/dashboard`);
            case 'inquilino':
                console.log('Login exitoso: Inquilino');
                return res.redirect(`/inquilino/${personaEncontrada.id}/dashboard`);
            default:
                console.log('Login exitoso con rol desconocido');
                return res.redirect('/');
        }

    } catch (error) {
        console.error('Error al procesar el login:', error);
        return res.status(500).render('error', { mensaje: 'Ocurrió un error en el servidor al intentar iniciar sesión.' });
    }
};
