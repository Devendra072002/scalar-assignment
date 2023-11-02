const express = require("express");
const router = express.Router();
const mentorController = require("../controller/mentor-controller");


router.get("/", mentorController.getMentors);
router.post("/", mentorController.createMentor);
router.get("/:mentorId", mentorController.getStudentAndMarksByMentorId);
router.put("/:studentId/assign-mentor/:mentorId", mentorController.assignMentorToStudent);


module.exports = router;
