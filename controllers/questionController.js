const catchAsync = require('../utils/catchAsync');
const Question = require('../models/questionModel');

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  let questions = await Question.find().populate(
    'answeredBy.user',
    '-__v -passwordChangedAt -passwordResetToken -passwordResetExpires -attendance -attendancePercentage -active -createdAt'
  );
  res.status(200).send({
    status: 'success',
    results: questions.length,
    data: {
      questions,
    },
  });
});
exports.createQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.create({
    adminId: req.user._id,
    title: req.body.title,
    question: req.body.question,
  });
  res.status(200).send({
    status: 'success',
    question,
  });
});

exports.answerQuestions;
