// src/controllers/adminUserController.js
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';

// @desc    Obtener todos los usuarios con filtros y búsqueda
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    let query = {};
    const { role, searchTerm } = req.query;

    if (role && role.toLowerCase() !== 'todos') {
      query.role = role.toLowerCase();
    }

    let users = await Usuario.find(query)
      .select('-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordExpire -__v')
      .lean();

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      users = users.filter(user =>
        searchRegex.test(user.username) ||
        searchRegex.test(user.email) ||
        (user.personalData?.firstName && searchRegex.test(user.personalData.firstName)) ||
        (user.personalData?.lastName && searchRegex.test(user.personalData.lastName)) ||
        (user.personalData?.dni && searchRegex.test(user.personalData.dni))
      );
    }

    const formattedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      function: user.function || '',
      isVerified: user.isVerified || false,
      fullName: `${user.personalData?.firstName || ''} ${user.personalData?.lastName || ''}`.trim(),
      dni: user.personalData?.dni || '',
      phone: user.personalData?.phone || '',
      address: user.personalData?.address || '',
      createdAt: user.createdAt
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.' });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id).select('-password -__v').lean();

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuario.' });
  }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/admin/users
// @access  Private (Admin only)
export const createUser = async (req, res) => {
  const { username, email, password, role, function: userFunction, personalData, isVerified } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'Por favor, introduce todos los campos requeridos: nombre de usuario, email, contraseña y rol.' });
  }

  try {
    const userExists = await Usuario.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario con ese email o nombre de usuario ya existe.' });
    }

    const newUser = new Usuario({
      username,
      email,
      password,
      role,
      function: userFunction,
      personalData: personalData || {},
      isVerified: isVerified || false
    });

    const createdUser = await newUser.save();

    const { password: _, verificationCode: __, verificationCodeExpires: ___, resetPasswordToken: ____, resetPasswordExpire: _____, ...userResponse } = createdUser.toObject();

    res.status(201).json({ message: 'Usuario creado con éxito.', user: userResponse });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error interno del servidor al crear usuario.' });
  }
};

// @desc    Actualizar un usuario existente
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res) => {
  const { username, email, password, role, function: userFunction, personalData, isVerified } = req.body;

  try {
    const user = await Usuario.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
    }

    user.username = username !== undefined ? username : user.username;
    user.email = email !== undefined ? email : user.email;
    user.role = role !== undefined ? role : user.role;
    user.function = userFunction !== undefined ? userFunction : user.function;
    user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (personalData) {
      user.personalData = {
        ...user.personalData,
        ...personalData
      };
    } else {
      if (!user.personalData) user.personalData = {};
    }

    const updatedUser = await user.save();

    const { password: _, verificationCode: __, verificationCodeExpires: ___, resetPasswordToken: ____, resetPasswordExpire: _____, ...userResponse } = updatedUser.toObject();

    res.status(200).json({ message: 'Usuario actualizado con éxito.', user: userResponse });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    } else if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese nombre de usuario o email.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al actualizar usuario.' });
  }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await Usuario.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar usuario.' });
  }
};

// @desc    Asignar/Actualizar la función de un empleado (o cualquier rol)
// @route   PUT /api/admin/users/:id/function
// @access  Private (Admin only)
export const assignUserFunction = async (req, res) => {
  const { function: newFunction } = req.body;

  try {
    const user = await Usuario.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.function = newFunction !== undefined ? newFunction : user.function;

    const updatedUser = await user.save();

    const { password: _, verificationCode: __, verificationCodeExpires: ___, resetPasswordToken: ____, resetPasswordExpire: _____, ...userResponse } = updatedUser.toObject();

    res.status(200).json({ message: 'Función de usuario actualizada con éxito.', user: userResponse });
  } catch (error) {
    console.error('Error al asignar función de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al asignar función.' });
  }
};

// Nueva función para "ver más" o detalles limitados
// Controlador para obtener detalles limitados de un usuario (para "ver más")
export const getUserDetails = async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id)
      .select('-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordExpire -__v')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const filteredUser = {
      username: user.username,
      email: user.email,
      role: user.role,
      function: user.function || '',
      fullName: `${user.personalData?.firstName || ''} ${user.personalData?.lastName || ''}`.trim(),
      dni: user.personalData?.dni || '',
      phone: user.personalData?.phone || '',
      address: user.personalData?.address || '',
      createdAt: user.createdAt,
      isVerified: user.isVerified || false,
    };

    res.status(200).json(filteredUser);
  } catch (error) {
    console.error('Error al obtener detalles del usuario:', error);
    res.status(500).json({ message: 'Error interno al obtener detalles del usuario.' });
  }
};

