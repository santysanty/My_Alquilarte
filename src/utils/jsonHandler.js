// src/utils/jsonHandler.js
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

export const readJsonFile = async (fileName) => {
    const filePath = path.join(DATA_DIR, fileName);
    console.log(`jsonHandler.js: Intentando leer archivo: ${filePath}`); // Nuevo log
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const data = await fs.readFile(filePath, 'utf-8');
        console.log(`jsonHandler.js: Lectura exitosa de ${fileName}`); // Nuevo log
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`jsonHandler.js: Archivo no encontrado al leer (${fileName}). Retornando array vacío.`); // Nuevo log
            return [];
        }
        console.error(`jsonHandler.js: Error al leer el archivo ${fileName}:`, error); // Log existente
        throw error;
    }
};

export const writeJsonFile = async (fileName, data) => {
    const filePath = path.join(DATA_DIR, fileName);
    console.log(`jsonHandler.js: Intentando escribir en archivo: ${filePath}`); // Nuevo log
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonString, 'utf-8');
        console.log(`jsonHandler.js: Escritura exitosa en ${fileName}`); // Nuevo log
    } catch (error) {
        console.error(`jsonHandler.js: Error al escribir en el archivo ${fileName}:`, error); // Log existente
        throw error;
    }
};