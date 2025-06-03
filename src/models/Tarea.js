// src/models/Tarea.js
class Tarea {
    constructor(tareaID, titulo, descripcion, estado, prioridad, fecha, area, empleadoId = null, informe = "", finalizada = false) {
        this.tareaID = tareaID;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.prioridad = prioridad;
        this.fecha = fecha; 
        this.area = area;
        this.empleadoId = empleadoId;
        this.informe = informe;
        this.finalizada = finalizada;
    }
}
export default Tarea; 

