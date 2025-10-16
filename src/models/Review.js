const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  juegoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'La referencia al juego es obligatoria']
  },
  puntuacion: {
    type: Number,
    required: [true, 'La puntuación es obligatoria'],
    min: [1, 'La puntuación mínima es 1'],
    max: [5, 'La puntuación máxima es 5'],
    validate: {
      validator: Number.isInteger,
      message: 'La puntuación debe ser un número entero'
    }
  },
  textoReseña: {
    type: String,
    required: [true, 'El texto de la reseña es obligatorio'],
    trim: true,
    minlength: [10, 'La reseña debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La reseña no puede exceder 1000 caracteres']
  },
  horasJugadas: {
    type: Number,
    required: [true, 'Las horas jugadas son obligatorias'],
    min: [0, 'Las horas jugadas no pueden ser negativas'],
    max: [10000, 'Las horas jugadas parecen excesivas']
  },
  dificultad: {
    type: String,
    required: [true, 'La dificultad es obligatoria'],
    enum: {
      values: ['Fácil', 'Normal', 'Difícil', 'Muy Difícil'],
      message: 'Dificultad no válida'
    }
  },
  recomendaria: {
    type: Boolean,
    required: [true, 'La recomendación es obligatoria']
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});


reviewSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.fechaActualizacion = Date.now();
  }
  next();
});

reviewSchema.pre('findOneAndUpdate', function(next) {
  this.set({ fechaActualizacion: Date.now() });
  next();
});


reviewSchema.index({ juegoId: 1 });
reviewSchema.index({ puntuacion: -1 });
reviewSchema.index({ fechaCreacion: -1 });

reviewSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

reviewSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

reviewSchema.statics.getGameStats = async function(gameId) {
  const stats = await this.aggregate([
    { $match: { juegoId: mongoose.Types.ObjectId(gameId) } },
    {
      $group: {
        _id: null,
        totalReseñas: { $sum: 1 },
        puntuacionPromedio: { $avg: '$puntuacion' },
        horasTotales: { $sum: '$horasJugadas' },
        recomendaciones: { $sum: { $cond: ['$recomendaria', 1, 0] } }
      }
    }
  ]);
  
  return stats[0] || null;
};

module.exports = mongoose.model('Review', reviewSchema);