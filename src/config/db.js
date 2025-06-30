// src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Asegúrate de importar dotenv si no lo has hecho

dotenv.config(); // Carga las variables de entorno

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Sale del proceso con un error
    }
};

export default connectDB;