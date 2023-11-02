const HttpError = require("../models/http-error");
const Mark = require("../models/mark")
const Student = require("../models/student")
const Mentor = require("../models/mentor");


// Create a new student
const createStudent = async (req, res) => {
    try {
        const { name, email } = req.body;
        const createdStudent = new Student({
            name,
            email,
        });

        try {
            await createdStudent.save();
            const marks = new Mark({
                studentId: createdStudent._id,
            })
            await marks.save();
        } catch (err) {
            const error = new HttpError("Signing up failed, please try again", 500);
            return error;
        }
        res.status(201).json(createdStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get Students whose mentor is assigned
const getAssignedStudents = async (req, res, next) => {
    let students;
    try {
        students = await Student.find({ isAssigned: true });
    } catch (err) {
        const error = new HttpError(
            "Fetching users failed, please try again later.",
            500
        );
    }

    res.json({ students: students.map((student) => student.toObject({ getters: true })) });
};

// Get Unassigned Students
const getUnAssignedStudents = async (req, res, next) => {
    let students;
    try {
        students = await Student.find({ isAssigned: false });
    } catch (err) {
        const error = new HttpError(
            "Fetching users failed, please try again later.",
            500
        );
    }
    res.json({ students: students.map((student) => student.toObject({ getters: true })) });
};

// Unassigned Mentor or Remove Mentor
const removeMentor = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        if (student.mentor) {
            const mentor = await Mentor.findById(student.mentor);

            if (mentor) {
                mentor.students.pull(studentId);
                await mentor.save();
            }
        }

        student.mentor = null;
        student.isAssigned = false;
        await student.save();

        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while removing the mentor and updating the student." });
    }
};

//Assign Marks to student
const assignMarks = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const updateFields = req.body;
        const isAnyFieldNull = Object.values(updateFields).some((value) => value === null);

        updateFields.isAllAssigned = !isAnyFieldNull;
        const updatedMarks = await Mark.findOneAndUpdate(
            { studentId: studentId },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedMarks) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.status(200).json(updatedMarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating the student." });
    }
};

exports.createStudent = createStudent;
exports.getAssignedStudents = getAssignedStudents;
exports.getUnAssignedStudents = getUnAssignedStudents;
exports.removeMentor = removeMentor;
exports.assignMarks = assignMarks;