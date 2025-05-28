// src/utils/jsonHandler.js
import { readFile, writeFile } from 'fs/promises';

export async function readJsonFile(filePath) {
    try {
        const data = await readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') { // Archivo no encontrado
            console.warn(`Archivo no encontrado en ${filePath}. Retornando array vacío.`);
            return [];
        }
        throw new Error(`Error al leer el archivo JSON ${filePath}: ${error.message}`);
    }
}

export async function writeJsonFile(filePath, data) {
    try {
        await writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        throw new new Error(`Error al escribir en el archivo JSON ${filePath}: ${error.message}`);
    }
}