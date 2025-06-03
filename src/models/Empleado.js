// src/models/Empleado.js

class Empleado {
    constructor(
        empleadoID, 
        nombre,
        apellido,
        dni, 
        correoElectronico,
        telefono,
        usuario, 
        contrasena, 
        rol, 
        subrol,
        foto = null 
    ) {
        this.empleadoID = empleadoID;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.correoElectronico = correoElectronico;
        this.telefono = telefono;
        this.usuario = usuario;
        this.contrasena = contrasena; 
        this.rol = 'empleado';
        this.subrol=this.subrol;
        this.foto = foto;
    }
}

export default Empleado;