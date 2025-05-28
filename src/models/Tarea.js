class Tarea {
  constructor(tareaID, descripcion, area, estado, prioridad, fechaCreacion, fechaVencimiento = null, asignadoA = null, propiedadId = null) {
    this.tareaID = tareaID;
    this.descripcion = descripcion;
    this.area = area;
    this.estado = estado; // e.g., 'pendiente', 'en proceso', 'finalizada'
    this.prioridad = prioridad; // e.g., 'alta', 'media', 'baja'
    this.fechaCreacion = fechaCreacion;
    this.fechaVencimiento = fechaVencimiento;
    this.asignadoA = asignadoA;
    this.propiedadId = propiedadId;
  }

  // Podrías añadir métodos si son necesarios, por ejemplo, para validar datos
  // isValid() { /* ... */ }
}

export default Tarea;