// src/utils/idGenerator.js

import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos
// Si no tienes 'uuid' instalado, puedes usar un método más simple o instalarlo: npm install uuid

// Función para generar un ID único basado en UUID v4
export const generateUniqueId = () => {
    return uuidv4();
};

// O, si no quieres instalar 'uuid', una función más simple (menos robusta pero funcional para IDs cortos)
// export const generateUniqueId = () => {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2);
// };