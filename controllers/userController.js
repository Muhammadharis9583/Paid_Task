const HttpError = require('../utils/httpError');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const QueryHandler = require('../utils/QueryHandler');

const updatableObjects = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((keyElement) => {
    if (allowedFields.includes(keyElement)) {
      newObj[keyElement] = obj[keyElement];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // -- BUILD QUERY --//

  // to allow nested GET reviews on tour based on tourId (just a hack).
  const docs = new QueryHandler(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

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
