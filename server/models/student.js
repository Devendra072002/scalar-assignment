const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const student = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mentor:
  {
    type: mongoose.Types.ObjectId,
    ref: "Mentor",
    default: null
  },
  isAssigned: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model("Student", student);
// student.plugin(uniqueValidator);
