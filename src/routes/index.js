const express = require('express');
const router = express.Router();

const gameRoutes = require('./gameRoutes');
const reviewRoutes = require('./reviewRoutes');

router.use('/juegos', gameRoutes);
router.use('/resenas', reviewRoutes);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎮 Bienvenido a GameTracker API',
    version: '1.0.0',
    endpoints: {
      juegos: {
        base: '/api/juegos',
        descripcion: 'CRUD completo para gestionar tu biblioteca de videojuegos',
        endpoints: [
          'GET /api/juegos - Obtener todos los juegos',
          'GET /api/juegos/stats - Estadísticas de la biblioteca',
          'GET /api/juegos/:id - Obtener juego específico',
          'POST /api/juegos - Agregar nuevo juego',
          'PUT /api/juegos/:id - Actualizar juego',
          'PATCH /api/juegos/:id/completado - Marcar como completado',
          'DELETE /api/juegos/:id - Eliminar juego'
        ]
      },
      resenas: {
        base: '/api/resenas',
        descripcion: 'CRUD completo para gestionar reseñas de videojuegos',
        endpoints: [
          'GET /api/resenas - Obtener todas las reseñas',
          'GET /api/resenas/stats - Estadísticas de reseñas',
          'GET /api/resenas/juego/:juegoId - Reseñas de un juego específico',
          'GET /api/resenas/:id - Obtener reseña específica',
          'POST /api/resenas - Crear nueva reseña',
          'PUT /api/resenas/:id - Actualizar reseña',
          'DELETE /api/resenas/:id - Eliminar reseña'
        ]
      }
    },
    features: [
      '📚 Gestión completa de biblioteca de videojuegos',
      '⭐ Sistema de reseñas con puntuaciones',
      '🔍 Filtros avanzados por género, plataforma, etc.',
      '📊 Estadísticas detalladas',
      '✅ Control de juegos completados',
      '⏱️ Registro de horas jugadas'
    ]
  });
});

router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: '/api para ver todos los endpoints disponibles'
  });
});

module.exports = router;