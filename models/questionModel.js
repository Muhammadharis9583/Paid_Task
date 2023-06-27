const mongoose = require('mongoose');
const userModel = require('./userModel');

const Schema = mongoose.Schema;
const questionModel = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()).toISOString(),
  },
  title: {
    type: String,
    required: [true, 'Title is required field'],
  },
  question: {
    type: String,
    required: [true, 'Question is required field'],
  },
});

module.exports = mongoose.model('Question', questionModel);
