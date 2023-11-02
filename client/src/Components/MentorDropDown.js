import React, { useState, useEffect } from 'react';

function MentorDropdown() {
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [editedMarks, setEditedMarks] = useState({}); // Edited marks for students

    const handleMentorSelect = (mentorId) => {
        setSelectedMentor(mentorId);
        // Clear edited marks when selecting a new mentor
        setEditedMarks({});
    };

    // Fetch mentors from your Express API
    useEffect(() => {
        fetch('http://localhost:5000/mentors')
            .then((response) => response.json())
            .then((data) => {
                setMentors(data.mentors);
            })
            .catch((error) => {
                console.error('Error fetching mentors: ', error);
            });
    }, []);

    useEffect(() => {
        if (selectedMentor) {
            // Fetch assigned students and their marks for the selected mentor
            fetch(`http://localhost:5000/students/mentor/${selectedMentor}`)
                .then((response) => response.json())
                .then((data) => {
                    setAssignedStudents(data.students);
                })
                .catch((error) => {
                    console.error('Error fetching assigned students: ', error);
                });
        }
    }, [selectedMentor]);

    // Helper function to filter fields that contain "exam" in the key
    const filterExamFields = (mark) => {
        if (!mark) {
            return [];
        }
        console.log(mark);
        return Object.keys(mark)
            .filter((key) => key.includes('exam'))
            .map((field) => ({ field, value: mark[field] }));
    };

    const handleMarkChange = (studentId, examName, newValue) => {
        // Update the edited marks object with the new value
        setEditedMarks((prevMarks) => ({
            ...prevMarks,
            [studentId]: {
                ...prevMarks[studentId],
                [examName]: newValue,
            },
        }));
    };

    const handleSaveMarks = (studentId) => {
        // Send the edited marks to the server to update the database
        // You would typically make an API request to update the marks in the backend
        const updatedMarks = editedMarks[studentId];

        fetch(`http://localhost:5000/students/${studentId}/assign-marks`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMarks),
        })
            .then((response) => response.json())
            .then((data) => {
                // Update the UI with the returned updated marks (optional)
                const updatedStudentIndex = assignedStudents.findIndex((student) => student._id === studentId);
                if (updatedStudentIndex !== -1) {
                    const updatedStudents = [...assignedStudents];
                    updatedStudents[updatedStudentIndex].marks = data; // Update the student's marks
                    setAssignedStudents(updatedStudents);
                }
                // Clear edited marks for this student
                setEditedMarks((prevMarks) => ({
                    ...prevMarks,
                    [studentId]: {},
                }));
            })
            .catch((error) => {
                console.error('Error saving marks: ', error);
            });
    };

    return (
        <div>
            <label htmlFor="mentor">Select a Mentor:</label>
            <select
                id="mentor"
                value={selectedMentor}
                onChange={(e) => handleMentorSelect(e.target.value)}
            >
                <option value="">Select a Mentor</option>
                {mentors.map((mentor) => (
                    <option key={mentor._id} value={mentor._id}>
                        {mentor.name}
                    </option>
                ))}
            </select>
            <p>Selected Mentor ID: {selectedMentor}</p>
            {assignedStudents.length > 0 && (
                <div>
                    <h2>Assigned Students and Their Marks</h2>
                    <ul>
                        {assignedStudents.map((student) => (
                            <li key={student._id}>
                                <strong>Name:</strong> {student.name}
                                <br />
                                <strong>Email:</strong> {student.email}
                                <br />
                                <strong>Student ID:</strong> {student._id}
                                <br />                                <div>
                                    <strong>Edit Marks:</strong>
                                    <ul>
                                        {Object.keys(student.marks || {})
                                            .filter((examName) => examName.includes('exam'))
                                            .map((examName) => (
                                                <li key={examName}>
                                                    {examName}:
                                                    <input
                                                        type="number"
                                                        value={editedMarks[student._id]?.[examName] || ''}
                                                        onChange={(e) =>
                                                            handleMarkChange(student._id, examName, e.target.value)
                                                        }
                                                    />
                                                </li>
                                            ))}
                                    </ul>

                                </div>
                                <button onClick={() => handleSaveMarks(student._id)}>Save Marks</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MentorDropdown;
