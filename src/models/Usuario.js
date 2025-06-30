import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UsuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, introduce un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'empleado', 'propietario', 'inquilino'],
        default: 'inquilino'
    },
    function: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcion',
        required: function () {
            return this.role === 'empleado';
        },
        default: null
    },
    personalData: {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        dni: { type: String, trim: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeExpires: {
        type: Date,
        select: false
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hashea la contraseña antes de guardarla
UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Método para comparar contraseñas
UsuarioSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Método para generar código de verificación
UsuarioSchema.methods.generateVerificationCode = function () {
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.verificationCode = code;
    this.verificationCodeExpires = Date.now() + 3600000;
    return code;
};

export default mongoose.model('Usuario', UsuarioSchema);
