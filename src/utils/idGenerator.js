// src/utils/idGenerator.js

import { readJsonFile } from './jsonHandler.js';

export const generateUniqueId = async () => {
  const empleados = await readJsonFile('empleados.json');
  const maxId = Math.max(0, ...empleados.map(e => parseInt(e.empleadoID)).filter(id => !isNaN(id)));
  return (maxId + 1).toString();
};
