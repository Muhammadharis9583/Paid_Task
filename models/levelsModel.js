const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const levelsSchema = new Schema({
  level_1: {
    start: {
      type: Date,
      default: () => Date.now(),
    },
    min_attendence_percentage: {
      type: Number,
      default: 80,
    },
    duration: {
      type: Date,
      default: () => Date.now() + 3 * (7 * 24 * 60 * 60 * 1000),
    },
  },
  level_2: {
    start: {
      type: Date,
      default: () => Date.now() + 3 * (7 * 24 * 60 * 60 * 1000),
    },
    min_attendence_percentage: {
      type: Number,
      default: 70,
    },
    duration: {
      type: Date,
      default: () => Date.now() + 7 * (7 * 24 * 60 * 60 * 1000),
    },
  },
});

module.exports = mongoose.model('Level', levelsSchema);
