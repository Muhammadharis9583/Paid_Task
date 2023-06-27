const express = require('express');
const router = express.Router();

const { restrictTo, protect } = require('../controllers/authController');
const { createQuestion, getAllQuestions } = require('../controllers/questionController');

router.use(protect, restrictTo('admin'));
router.get('/', getAllQuestions);
router.post('/', createQuestion);

module.exports = router;
