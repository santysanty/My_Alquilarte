// hash_password.cjs
const bcrypt = require('bcryptjs'); // Usamos 'require' en lugar de 'import'

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10); // Genera una "sal" para el hash
        const hashedPassword = await bcrypt.hash(password, salt); // Hashea la contraseña con la sal
        console.log(`---`);
        console.log(`Contraseña original: "${password}"`);
        console.log(`HASH GENERADO: "${hashedPassword}"`);
        console.log(`---`);
    } catch (error) {
        console.error("Error al hashear la contraseña:", error);
    }
}

hashPassword('adminRoot'); // <-- Aquí se usa la contraseña "adminRoot"