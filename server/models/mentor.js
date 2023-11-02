const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const mentor = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    students: [
        {
            type: String,
        }],

});


module.exports = mongoose.model("Mentor", mentor);
// student.plugin(uniqueValidator);
