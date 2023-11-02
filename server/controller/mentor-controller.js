const HttpError = require("../models/http-error");

const Mark = require("../models/mark")
const Student = require("../models/student")
const Mentor = require("../models/mentor");


//Get Mentors
const getMentors = async (req, res, next) => {
    let mentors;
    try {
        mentors = await Mentor.find({});
    } catch (err) {
        const error = new HttpError(
            "Fetching users failed, please try again later.",
            500
        );
    }
    console.log("sending_Data");
    res.json({ mentors: mentors.map((mentor) => mentor.toObject({ getters: true })) });
};


//Create a new Mentor 
const createMentor = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email } = req.body;
        const createdMentor = new Mentor({
            name,
            email,
            students: [],
        });

        try {
            await createdMentor.save();
        } catch (err) {
            const error = new HttpError("Signing up failed, please try again", 500);
            return error;
        }
        res.status(201).json(createdMentor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



//Get Student and Marks by Mentor Id
const getStudentAndMarksByMentorId = async (req, res) => {
    try {
        const mentorId = req.params.mentorId;

        const mentor = await Mentor.findById(mentorId);

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found" });
        }

        const students = await Student.find({ mentor: mentorId });

        const studentIds = students.map((student) => student._id);

        const marks = await Mark.find({ studentId: { $in: studentIds } });

        const studentMarksMap = {};
        marks.forEach((mark) => {
            studentMarksMap[mark.studentId] = mark;
        });

        const studentsWithMarks = students.map((student) => {
            return {
                ...student.toObject(),
                marks: studentMarksMap[student._id] || {},
            };
        });

        res.status(200).json({ students: studentsWithMarks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
};

// Assign a Mentor to a Student and add the Student to the Mentor's students array
const assignMentorToStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const mentorId = req.params.mentorId;

        const student = await Student.findById(studentId);
        const mentor = await Mentor.findById(mentorId);

        if (!student || !mentor) {
            return res.status(404).json({ error: "Student or mentor not found" });
        }

        student.mentor = mentor;
        student.isAssigned = true;
        await student.save();

        mentor.students.push(studentId);
        await mentor.save();
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while assigning the mentor." });
    }
};




exports.getStudentAndMarksByMentorId = getStudentAndMarksByMentorId;
exports.getMentors = getMentors;
exports.createMentor = createMentor;
exports.assignMentorToStudent = assignMentorToStudent;