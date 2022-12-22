const mongoose = require('mongoose')
const Schema = mongoose.Schema

const levelsSchema = new Schema({
  level_1: {
    attendence_percentage: {
      type: Number,
      default: 80,
    },
    duration: {
      type: Date,
      default: () => Date.now() + 3 * (7 * 24 * 60 * 60 * 1000),
    },
  },
  level_2: {
    attendence_percentage: {
      type: Number,
      default: 70,
    },
    duration: {
      type: Date,
      default: () => Date.now() + 7 * (7 * 24 * 60 * 60 * 1000),
    },
  },
  level_3: {
    attendence_percentage: {
      type: Number,
      default: 70,
    },
    duration: {
      type: Date,
      default: () => Date.now() + 10 * (7 * 24 * 60 * 60 * 1000),
    },
  },
});

module.exports = mongoose.model('Level', levelsSchema)