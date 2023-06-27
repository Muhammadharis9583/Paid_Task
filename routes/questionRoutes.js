const express = require('express');
const router = express.Router();

const { restrictTo, protect } = require('../controllers/authController');
const { createQuestion } = require('../controllers/questionController');

router.use(protect, restrictTo('admin'));
router.post('/', createQuestion);

module.exports = router;
