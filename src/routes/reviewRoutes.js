const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewsByGame,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} = require('../controllers/reviewController');

router.get('/', getAllReviews);                  
router.get('/stats', getReviewStats);            
router.get('/juego/:juegoId', getReviewsByGame); 
router.get('/:id', getReviewById);               
router.post('/', createReview);                  
router.put('/:id', updateReview);                
router.delete('/:id', deleteReview);            

module.exports = router;