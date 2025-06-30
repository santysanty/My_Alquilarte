import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear el directorio si no existe
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Extensiones permitidas
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `foto-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// Validación del archivo
const fileFilter = (_, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no válido. Solo JPG, PNG, GIF.'));
  }
};

// Tamaño máximo (5 MB)
const limits = {
  fileSize: 5 * 1024 * 1024
};

// Configuración final de multer
const upload = multer({
  storage,
  fileFilter,
  limits
});

export default upload;
