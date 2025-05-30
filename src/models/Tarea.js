// src/models/Tarea.js
class Tarea {
    constructor(tareaID, titulo, descripcion, estado, prioridad, fecha, area, empleadoId = null, informe = "", finalizada = false) {
        this.tareaID = tareaID;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.prioridad = prioridad;
        this.fecha = fecha; // Asegúrate de manejar el formato de fecha
        this.area = area;
        this.empleadoId = empleadoId;
        this.informe = informe;
        this.finalizada = finalizada;
    }
}
export default Tarea; // Usa export default para el import de arriba

