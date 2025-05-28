// src/app.js (versión refactorizada)
import express from 'express';
import path from 'path'; // Para path.join
import { fileURLToPath } from 'url'; // Para __dirname
import methodOverride from 'method-override';

// Importar Routers
// ... (cuando María y Manuel hagan su parte, importar sus routers)

import indexRoutes from './routes/indexRoutes.js';
import authRoutes from './routes/authRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;

// Para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, '..', 'public'))); // Ruta corregida para archivos estáticos

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'views')); // Ruta corregida para vistas

// Usar Routers
app.use('/', indexRoutes); // Para / , /inicio, /admin, /empleado (general)
app.use('/', authRoutes);  // Para /login
app.use('/cuenta', empleadoRoutes); // Para todas las rutas de /cuenta (empleados)
app.use('/tareas', tareaRoutes);   // Para todas las rutas de /tareas

// Manejo de errores 404 (al final de todas las rutas)
app.use((req, res) => {
    res.status(404).render('error', { mensaje: 'Página no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}).on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error(`¡El puerto ${PORT} ya está en uso!`);
        process.exit(1);
    }
    console.error(err);
});