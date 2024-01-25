const express = require('express');
const router = express.Router();

//importando controladores
const { getAllSessionsByTeacher, getSessionsByStudent, getSessionById, addNewSession, updateSession } = require('../controllers/session-controller');

//get all sessions from techerId
router.get('/teacher/:teacherId', getAllSessionsByTeacher);

//get todas las sessiones de un mismo estudiante
router.get('/student/:studentId', getSessionsByStudent);

//get by ID
router.get('/:id', getSessionById);

//create new
router.post('/student-subject/:fkIdStudentSubject', addNewSession);

//update
router.put('/:id', updateSession);

module.exports = router;