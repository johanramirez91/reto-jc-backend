const { Game, Review } = require('../models');
const mongoose = require('mongoose');

const getAllGames = async (req, res) => {
  try {
    const {
      genero,
      plataforma,
      completado,
      año,
      desarrollador,
      sortBy = 'fechaCreacion',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    if (genero) filters.genero = genero;
    if (plataforma) filters.plataforma = plataforma;
    if (completado !== undefined) filters.completado = completado === 'true';
    if (año) filters.añoLanzamiento = parseInt(año);
    if (desarrollador) filters.desarrollador = new RegExp(desarrollador, 'i');

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const games = await Game.find(filters).sort(sortOptions);

    res.status(200).json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de juego no válido'
      });
    }

    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    const reviewStats = await Review.getGameStats(id);

    res.status(200).json({
      success: true,
      data: {
        ...game.toJSON(),
        stats: reviewStats
      }
    });
  } catch (error) {
    console.error('Error al obtener juego:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const createGame = async (req, res) => {
  try {
    const gameData = req.body;
    const newGame = new Game(gameData);
    const savedGame = await newGame.save();

    res.status(201).json({
      success: true,
      message: 'Juego agregado exitosamente a tu biblioteca',
      data: savedGame
    });
  } catch (error) {
    console.error('Error al crear juego:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de juego no válido'
      });
    }

    const updatedGame = await Game.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedGame) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Juego actualizado exitosamente',
      data: updatedGame
    });
  } catch (error) {
    console.error('Error al actualizar juego:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de juego no válido'
      });
    }

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    await Review.deleteMany({ juegoId: id });

    await Game.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Juego eliminado exitosamente de tu biblioteca'
    });
  } catch (error) {
    console.error('Error al eliminar juego:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const toggleGameCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de juego no válido'
      });
    }

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    game.completado = !game.completado;
    await game.save();

    res.status(200).json({
      success: true,
      message: `Juego marcado como ${game.completado ? 'completado' : 'no completado'}`,
      data: game
    });
  } catch (error) {
    console.error('Error al cambiar estado del juego:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getLibraryStats = async (req, res) => {
  try {
    const stats = await Game.aggregate([
      {
        $group: {
          _id: null,
          totalJuegos: { $sum: 1 },
          juegosCompletados: { $sum: { $cond: ['$completado', 1, 0] } },
          juegosPorGenero: { $push: '$genero' },
          juegosPorPlataforma: { $push: '$plataforma' }
        }
      },
      {
        $project: {
          _id: 0,
          totalJuegos: 1,
          juegosCompletados: 1,
          porcentajeCompletado: {
            $multiply: [
              { $divide: ['$juegosCompletados', '$totalJuegos'] },
              100
            ]
          },
          juegosPorGenero: 1,
          juegosPorPlataforma: 1
        }
      }
    ]);

    const generoCount = {};
    const plataformaCount = {};

    if (stats[0]) {
      stats[0].juegosPorGenero.forEach(genero => {
        generoCount[genero] = (generoCount[genero] || 0) + 1;
      });

      stats[0].juegosPorPlataforma.forEach(plataforma => {
        plataformaCount[plataforma] = (plataformaCount[plataforma] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...stats[0],
        distribuccionGeneros: generoCount,
        distribuccionPlataformas: plataformaCount
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  toggleGameCompleted,
  getLibraryStats
};