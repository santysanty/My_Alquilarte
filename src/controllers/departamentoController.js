import Department from '../models/Departamento.js';

/**
 * Crear nuevo departamento
 */
export const createDepartment = async (req, res) => {
  const { name, description, isActive } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'El nombre del departamento es requerido.' });
  }

  try {
    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Ya existe un departamento con ese nombre.' });
    }

    const department = new Department({
      name,
      description,
      isActive: isActive !== undefined ? isActive : true
    });

    const created = await department.save();
    res.status(201).json({
      message: 'Departamento creado exitosamente.',
      department: created
    });
  } catch (error) {
    console.error('Error al crear departamento:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear departamento.', error: error.message });
  }
};

/**
 * Obtener todos los departamentos
 */
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener departamentos.', error: error.message });
  }
};

/**
 * Obtener departamento por ID
 */
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error('Error al obtener departamento por ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de departamento inválido.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al obtener departamento.', error: error.message });
  }
};

/**
 * Actualizar departamento por ID
 */
export const updateDepartment = async (req, res) => {
  const { name, description, isActive } = req.body;

  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }

    if (name && name !== department.name) {
      const exists = await Department.findOne({ name });
      if (exists) {
        return res.status(400).json({ message: 'Ya existe otro departamento con ese nombre.' });
      }
    }

    department.name = name || department.name;
    department.description = description !== undefined ? description : department.description;
    department.isActive = isActive !== undefined ? isActive : department.isActive;

    const updated = await department.save();
    res.status(200).json({
      message: 'Departamento actualizado exitosamente.',
      department: updated
    });
  } catch (error) {
    console.error('Error al actualizar departamento:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de departamento inválido.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al actualizar departamento.', error: error.message });
  }
};

/**
 * Eliminar departamento por ID
 */
export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }
    res.status(200).json({ message: 'Departamento eliminado exitosamente.', department: deleted });
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de departamento inválido.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al eliminar departamento.', error: error.message });
  }
};
