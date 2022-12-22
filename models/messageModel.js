const mongoose = require("mongoose")
const userModel = require("./userModel")

const Schema = mongoose.Schema
const messageModel = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  notifiaction_date: {
    type: Date,
    default: new Date(Date.now()).toISOString(),
  },
  title:{
    type: String,
    required: [true, 'Title is required field']
  },
  message:{
    type: String,
  }
});