const express = require("express");
const studentController = require("../controller/student-controller");

const router = express.Router();

router.post("/", studentController.createStudent);
router.get("/assigned", studentController.getAssignedStudents);
router.get("/un-assigned", studentController.getUnAssignedStudents);
router.put("/:studentId/remove-mentor", studentController.removeMentor);
router.put("/:studentId/assign-marks", studentController.assignMarks);

module.exports = router;