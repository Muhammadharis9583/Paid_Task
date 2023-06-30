const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const questionModel = new Schema({
  adminId: {
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
  questionLevel: {
    type: Number,
    required: [true, 'Question level is required field'],
  },
  answeredBy: [
    {
      user: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        name: {
          type: String,
          required: [true, 'Name is required field'],
        },
        email: {
          type: String,
          required: [true, 'Email is required field'],
        },
        currentLevel: {
          type: Number,
          required: [true, 'Current level is required field'],
        },
      },
      answer: {
        type: String,
        required: [true, 'Answer is required field'],
      },
    },
  ],
});

module.exports = mongoose.model('Question', questionModel);
