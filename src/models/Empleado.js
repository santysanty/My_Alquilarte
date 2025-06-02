// src/models/Empleado.js

class Empleado {
    constructor(
        empleadoID, // Identificador único para el empleado
        nombre,
        apellido,
        dni, // DNI o documento de identidad
        correoElectronico,
        telefono,
        usuario, // Nombre de usuario para el login
        contrasena, // Contraseña (¡IMPORTANTE! Idealmente, debería ser hasheada, no guardada en texto plano)
        rol, // Rol del empleado (ej. 'Administrador', 'Empleado', 'Supervisor', 'Agente Inmobiliario', 'Contador')
        subrol,
        foto = null // URL o ruta a la foto del empleado, opcional
    ) {
        this.empleadoID = empleadoID;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.correoElectronico = correoElectronico;
        this.telefono = telefono;
        this.usuario = usuario;
        this.contrasena = contrasena; // Considerar hashing en un entorno real
        this.rol = 'empleado';
        this.subrol=this.subrol;
        this.foto = foto;
    }
}

export default Empleado;