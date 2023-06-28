const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const HttpError = require('../utils/httpError');
const catchAsync = require('../utils/catchAsync');
const QueryHandler = require('../utils/QueryHandler');
const User = require('../models/userModel');
const Question = require('../models/questionModel');
const { default: mongoose } = require('mongoose');

const updatableObjects = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((keyElement) => {
    if (allowedFields.includes(keyElement)) {
      newObj[keyElement] = obj[keyElement];
    }
  });
  return newObj;
};

const hasAlreadyAnsweredQuestion = (question, user) => {
  return question.answeredBy.reduce((acc, curr) => {
    if (curr.user.toString() === user._id.toString()) {
      return true;
    }
    return false;
  }, false);
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // -- BUILD QUERY --//

  // to allow nested GET reviews on tour based on tourId (just a hack).
  const docs = new QueryHandler(User.find(), req.query).filter().sort().limitFields().paginate();

  const users = await docs.query;

  // Tour.find() will populate the tour with the user{guide} with the help of pre find middleware

  // localhost:8000/tours?fields=name,desciption&sort=price
  // {fields: name,description}
  /*
       get the features obj from APIFeaturs class that takes the FIND query and our query string and apply different functions to the query.
      */

  // -- EXECUTE QUERY --//
  //const docs = await features.query;

  // -- SEND RESPONSE --//

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new HttpError('Could not find an account for the provided id!', 404));
  }

  res.status(200).send({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new HttpError('No User with that id found', 404));
  }
  res.status(200).send({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new HttpError('No User with that id found', 404));
  }

  res.status(204).send({
    status: 'success',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new HttpError('This route does not support updating password!', 400));
  }

  const filteredObjects = updatableObjects(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObjects, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).send({
    status: 'success',
    data: null,
  });
});
exports.getMyAccount = (req, res, next) => {
  // just set the req.params.id to the userId of the currently logged in object that will send the user object as a part of requeste using the protect middleware in the authController.

  req.params.id = req.user.id;
  next();
};

exports.markAttendance = async (req, res, next) => {
  const user = req.user;
  const question = await Question.findOne({ _id: req.body.questionId });
  if (!question) {
    return next(new HttpError('No question found with that id', 404));
  }
  if (question.questionLevel !== user.currentLevel) {
    return next(new HttpError('You cannot answer this question', 400));
  }
  if (hasAlreadyAnsweredQuestion(question, user)) {
    return next(new HttpError('You have already answered this question', 400));
  }
  question.answeredBy.push({ user: user._id, answer: req.body.answer });
  await question.save({ validateBeforeSave: false });

  try {
    user.attendance.push({
      markedAt: Date.now(),
      attended: true,
    });
    // calculated attendance percentage
    await user.populate('levels');

    const totalAttended = user.attendance.length;
    const start = user.currentLevel === 1 ? user.levels.level_1.start : user.levels.level_2.start;
    const daysPast = getDaysDifference(start);

    const attendancePercentage = (totalAttended / daysPast) * 100;
    user.attendancePercentage = attendancePercentage;
    await user.save({ validateBeforeSave: false });
    return res.status(200).send({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    return next(new HttpError('Could not mark attendance', 500));
  }
};

exports.getMonthlyAttendance = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const monthlyAttendance = await User.aggregate([
    /**
     * 1. Find the user with the provided id.
     */
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.user._id),
      },
    },
    /**
     * 2. Unwind the attendance array.
     * Destruct each element of array and output one docuemnt for each element of the array.
     * Here it will create a new document for all the startDates.
     */
    {
      $unwind: '$attendance',
    },
    // 3. Get markedAt from every attendance object in the array. This will be the only field in the document along with the _id.
    {
      $project: {
        markedAt: '$attendance.markedAt',
      },
    },
    /**
     * 4. Filter the documents based on the markedAt field.
     * Get all the documents that have markedAt field between the start and end date of the provided year.
     */
    {
      $match: {
        markedAt: {
          $gte: new Date(`${year}-01-01`), //greater than or equal to the start of the year
          $lte: new Date(`${year}-12-31`), //less than or equal to the end of the year
        },
      },
    },
    /**
     * 5. Group the documents based on the month of the markedAt field.
     * The _id of the group will be the month of the markedAt field. The attendanceCount will be the number of documents in the group by adding 1 for each document.
     */
    {
      $group: {
        _id: {
          $month: '$markedAt',
        },
        attendanceCount: { $sum: 1 },
      },
    },
    /**
     * 6. Add a new field called month to the document.
     * The value of the month field will be the _id of the group.
     */
    {
      $addFields: {
        month: '$_id',
      },
    },
    /**
     * 7. Project the fields that we want to send to the client.
     * We don't want the _id field so we set it to 0.
     * We want the attendanceCount and month field so we set them to 1.
     */
    {
      $project: {
        _id: 0,
        attendanceCount: 1,
        month: 1,
      },
    },
  ]);

  res.status(200).send({
    status: 'success',
    monthlyAttendance,
  });
});

// get the number of days from today to the provided time
const getDaysDifference = (time) => {
  const today = new Date();
  const endDate = new Date(time);
  // get the difference between the two dates
  const diffTime = Math.abs(endDate - today);
  // divide the time by the number of milliseconds in a day
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
