import { readFile, writeFile } from 'fs/promises';

export const leerJSON = async (ruta) => {
  try {
    return JSON.parse(await readFile(ruta, 'utf-8'));
  } catch {
    return [];
  }
};

export const escribirJSON = async (ruta, data) => {
  await writeFile(ruta, JSON.stringify(data, null, 2));
};
