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
  answeredBy: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      answer: {
        type: String,
        required: [true, 'Answer is required field'],
      },
    },
  ],
});

module.exports = mongoose.model('Question', questionModel);
