const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mark = new Schema({
  studentId: {
    type: String,
    required: true,
  },
  exam1: {
    type: Number,
    default: null,
  },
  exam2: {
    type: Number,
    default: null,
  },
  exam3: {
    type: Number,
    default: null,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  isAllAssigned: {
    type: Boolean,
    default: false,
  },

});

module.exports = mongoose.model("Mark", mark);
