const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título del juego es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    enum: {
      values: ['Acción', 'RPG', 'Estrategia', 'Aventura', 'Deportes', 'Simulación', 'Puzzle', 'Plataformas', 'Supervivencia', 'Terror', 'Carreras', 'Lucha'],
      message: 'Género no válido'
    }
  },
  plataforma: {
    type: String,
    required: [true, 'La plataforma es obligatoria'],
    enum: {
      values: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'PlayStation 5', 'Xbox Series X/S', 'PlayStation 4', 'Xbox One'],
      message: 'Plataforma no válida'
    }
  },
  añoLanzamiento: {
    type: Number,
    required: [true, 'El año de lanzamiento es obligatorio'],
    min: [1970, 'El año debe ser mayor a 1970'],
    max: [new Date().getFullYear() + 2, 'El año no puede ser mayor al año actual + 2']
  },
  desarrollador: {
    type: String,
    required: [true, 'El desarrollador es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre del desarrollador no puede exceder 50 caracteres']
  },
  imagenPortada: {
    type: String,
    default: 'https://via.placeholder.com/400x600?text=Sin+Imagen',
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url) || url === 'https://via.placeholder.com/400x600?text=Sin+Imagen';
      },
      message: 'La URL de la imagen debe ser válida y terminar en jpg, jpeg, png, webp o gif'
    }
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  completado: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

gameSchema.index({ genero: 1 });
gameSchema.index({ plataforma: 1 });
gameSchema.index({ completado: 1 });
gameSchema.index({ añoLanzamiento: -1 });

gameSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

gameSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Game', gameSchema);