const express = require('express');
const router = express.Router();

//importando controladores
const { getAllStudentSubjects, getSubjectsByStudent, getStudentsBySubject, addNewStudentSubject, deleteStudentSubject } = require('../controllers/studentSubject-controller');
//get
router.get('/', getAllStudentSubjects);

//get subjects by student
router.get('/student/:studentId', getSubjectsByStudent)

//get students by subjects
router.get('/subject/:subjectId', getStudentsBySubject);

//add new student_subject
router.post('/', addNewStudentSubject)

//delete student_subject
router.delete('/:studentId', deleteStudentSubject )
module.exports = router;