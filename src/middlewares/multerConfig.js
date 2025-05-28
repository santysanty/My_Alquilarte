// src/middlewares/multerConfig.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, `foto-<span class="math-inline">\{Date\.now\(\)\}</span>{path.extname(file.originalname)}`)
});

const upload = multer({ storage });
export default upload;