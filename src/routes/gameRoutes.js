const express = require('express');
const router = express.Router();
const {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  toggleGameCompleted,
  getLibraryStats
} = require('../controllers/gameController');

router.get('/', getAllGames);                    
router.get('/stats', getLibraryStats);          
router.get('/:id', getGameById);                 
router.post('/', createGame);                    
router.put('/:id', updateGame);                  
router.patch('/:id/completado', toggleGameCompleted); 
router.delete('/:id', deleteGame);               

module.exports = router;