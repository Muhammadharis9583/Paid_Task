const catchAsync = require('../utils/catchAsync');
const Question = require('../models/questionModel');

exports.createQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.create({
    userId: req.user._id,
    title: req.body.title,
    question: req.body.question,
  });
  res.status(200).send({
    status: 'success',
    question,
  });
});
