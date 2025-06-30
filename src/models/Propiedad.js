import mongoose from 'mongoose';

const propiedadSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  tipo: String,
  transaccion: String,
  precio: {
    valor: Number,
    moneda: String,
    expensas: Number,
    todoIncluido: Boolean
  },
  ubicacion: {
    calle: String,
    numero: String,
    piso: String,
    departamento: String,
    ciudad: String,
    provincia: String,
    codigoPostal: String,
    pais: String,
    coordenadas: {
      lat: Number,
      lng: Number
    }
  },
  caracteristicas: {
    habitaciones: Number,
    banos: Number,
    metrosCuadrados: Number,
    antiguedad: Number,
    amoblado: Boolean,
    balcon: Boolean,
    piscina: Boolean,
    gimnasio: Boolean
  },
  serviciosCercanos: {
    hospitales: [
      {
        nombre: String,
        distanciaKm: Number
      }
    ],
    universidades: [
      {
        nombre: String,
        distanciaKm: Number
      }
    ]
  },
  imagenUrl: String,
  tags: [String],
  activo: Boolean,
  propietarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true,
  collection: 'propiedades' // ✅ Esta línea es clave
});

// Exporta el modelo apuntando a la colección correcta
export default mongoose.model('Propiedad', propiedadSchema, 'propiedades');
