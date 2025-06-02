// src/models/Usuario.js

class Usuario {
  constructor(
    usuarioID,
    nombre,
    apellido,
    dni,
    correoElectronico,
    telefono,
    usuario,
    contrasena,
    rol,
    subrol = '',
    foto = null
  ) {
    this.usuarioID = usuarioID;
    this.id = usuarioID; // Compatibilidad con búsquedas por id
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.correoElectronico = correoElectronico;
    this.telefono = telefono;
    this.usuario = usuario;
    this.contrasena = contrasena;
    this.rol = rol;
    this.subrol = subrol;
    this.foto = foto;
  }
}

export default Usuario;
