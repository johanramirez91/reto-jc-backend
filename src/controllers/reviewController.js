const { Review, Game } = require('../models');
const mongoose = require('mongoose');

const getAllReviews = async (req, res) => {
  try {
    const {
      puntuacion,
      dificultad,
      recomendaria,
      sortBy = 'fechaCreacion',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    if (puntuacion) filters.puntuacion = parseInt(puntuacion);
    if (dificultad) filters.dificultad = dificultad;
    if (recomendaria !== undefined) filters.recomendaria = recomendaria === 'true';

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(filters)
      .populate('juegoId', 'titulo genero plataforma imagenPortada')
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getReviewsByGame = async (req, res) => {
  try {
    const { juegoId } = req.params;
    const {
      sortBy = 'fechaCreacion',
      sortOrder = 'desc'
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(juegoId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de juego no válido'
      });
    }

    const game = await Game.findById(juegoId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado'
      });
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({ juegoId })
      .populate('juegoId', 'titulo genero plataforma imagenPortada')
      .sort(sortOptions);

    const stats = await Review.getGameStats(juegoId);

    res.status(200).json({
      success: true,
      data: reviews,
      gameInfo: {
        titulo: game.titulo,
        genero: game.genero,
        plataforma: game.plataforma
      },
      stats: stats
    });
  } catch (error) {
    console.error('Error al obtener reseñas por juego:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de reseña no válido'
      });
    }

    const review = await Review.findById(id)
      .populate('juegoId', 'titulo genero plataforma imagenPortada desarrollador');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error al obtener reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const createReview = async (req, res) => {
  try {
    const reviewData = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewData.juegoId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de juego no válido'
      });
    }

    const game = await Game.findById(reviewData.juegoId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'No se puede crear reseña: el juego no existe'
      });
    }

    const newReview = new Review(reviewData);
    const savedReview = await newReview.save();

    const populatedReview = await Review.findById(savedReview._id)
      .populate('juegoId', 'titulo genero plataforma imagenPortada');

    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: populatedReview
    });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    
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

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de reseña no válido'
      });
    }

    if (updateData.juegoId) {
      if (!mongoose.Types.ObjectId.isValid(updateData.juegoId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de juego no válido'
        });
      }

      const game = await Game.findById(updateData.juegoId);
      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'No se puede actualizar: el juego no existe'
        });
      }
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('juegoId', 'titulo genero plataforma imagenPortada');

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reseña actualizada exitosamente',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    
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

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de reseña no válido'
      });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reseña eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalResenas: { $sum: 1 },
          puntuacionPromedio: { $avg: '$puntuacion' },
          horasTotalesJugadas: { $sum: '$horasJugadas' },
          totalRecomendaciones: { $sum: { $cond: ['$recomendaria', 1, 0] } },
          distribuccionPuntuaciones: {
            $push: '$puntuacion'
          },
          distribuccionDificultad: {
            $push: '$dificultad'
          }
        }
      }
    ]);

    let puntuacionCount = {};
    let dificultadCount = {};

    if (stats[0]) {
      stats[0].distribuccionPuntuaciones.forEach(puntuacion => {
        puntuacionCount[puntuacion] = (puntuacionCount[puntuacion] || 0) + 1;
      });

      stats[0].distribucionDificultad.forEach(dificultad => {
        dificultadCount[dificultad] = (dificultadCount[dificultad] || 0) + 1;
      });
    }

    const topGames = await Review.aggregate([
      {
        $group: {
          _id: '$juegoId',
          puntuacionPromedio: { $avg: '$puntuacion' },
          totalResenas: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: '_id',
          as: 'juego'
        }
      },
      {
        $unwind: '$juego'
      },
      {
        $sort: { puntuacionPromedio: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          titulo: '$juego.titulo',
          genero: '$juego.genero',
          puntuacionPromedio: { $round: ['$puntuacionPromedio', 1] },
          totalResenas: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats[0],
        puntuacionPromedio: stats[0] ? Math.round(stats[0].puntuacionPromedio * 10) / 10 : 0,
        porcentajeRecomendacion: stats[0] ? Math.round((stats[0].totalRecomendaciones / stats[0].totalResenas) * 100) : 0,
        distribuccionPuntuaciones: puntuacionCount,
        distribuccionDificultad: dificultadCount,
        topJuegosPuntuacion: topGames
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de reseñas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewsByGame,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
};