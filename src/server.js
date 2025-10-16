const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const apiRoutes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎮 GameTracker API está funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: {
      api: '/api',
      games: '/api/juegos',
      reviews: '/api/resenas'
    },
    description: 'API REST para gestionar biblioteca de videojuegos con reseñas'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({    
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    suggestion: '/api para ver los endpoints disponibles'
  });
});

app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: validationErrors
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
      error: 'El ID no tiene el formato correcto'
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: 'Recurso duplicado',
      error: `El ${field} ya existe en la base de datos`
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON error',
      error: 'Verifica la sintaxis del JSON enviado'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

process.on('unhandledRejection', (err, promise) => {
  console.error('Promesa rechazada no manejada:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err.message);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🎮 GAMETRACKER API 🎮                    ║
╠══════════════════════════════════════════════════════════════╣
║  Servidor iniciado exitosamente                              ║
║  Puerto: ${PORT}                                             ║
║  Entorno: ${process.env.NODE_ENV || 'development'}           ║
║  URL Base: http://localhost:${PORT}                          ║
║  API Docs: http://localhost:${PORT}/api                      ║
║                                                              ║
║  📚 Endpoints principales:                                  ║
║  • GET  /api/juegos     - Lista de videojuegos              ║
║  • POST /api/juegos     - Agregar videojuego                ║
║  • GET  /api/resenas    - Lista de reseñas                  ║
║  • POST /api/resenas    - Crear reseña                      ║
║                                                             ║
║  Presiona Ctrl+C para detener el servidor                   ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;