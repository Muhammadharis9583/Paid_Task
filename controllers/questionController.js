const catchAsync = require('../utils/catchAsync');
const Question = require('../models/questionModel');
const HttpError = require('../utils/httpError');

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
  const existingQuestion = await getQuestion();
  if (existingQuestion) {
    return next(new HttpError('A question has already been created for today', 400));
  }
  const question = await Question.create({
    adminId: req.user._id,
    title: req.body.title,
    question: req.body.question,
  });
  res.status(200).send({
    status: 'success',
    data: { question },
  });
});
exports.getDailyQuestion = catchAsync(async (req, res, next) => {
  const question = await getQuestion();
  if (!question) {
    return next(new HttpError('No question found for today', 404));
  }
  res.status(200).send({
    status: 'success',
    data: { question },
  });
});

// -------------------------------------------------
async function getQuestion() {
  // get the start of today form 12AM.
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  // get the end of today from 11:59PM.
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  //   find the question that was created between the start and end of today.
  const question = await Question.findOne({ createdAt: { $gte: start, $lte: end } }).populate(
    'answeredBy.user',
    '-__v -passwordChangedAt -passwordResetToken -passwordResetExpires -attendance -attendancePercentage -active -createdAt'
  );
  return question;
}
