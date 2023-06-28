const express = require('express');
const router = express.Router();

const { restrictTo, protect } = require('../controllers/authController');
const {
  createQuestion,
  getAllQuestions,
  getDailyQuestion,
} = require('../controllers/questionController');

router.use(protect);
router.get('/dailyQuestion/:questionLevel', getDailyQuestion);
router.use(restrictTo('admin'));
router.get('/', getAllQuestions);
router.post('/', createQuestion);

module.exports = router;
