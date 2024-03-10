const express = require('express');
const router = express.Router();

//importando controladores
const { getAllSessionsByTeacher, getSessionsByStudent, getSessionById, addNewSession, updateSession, getPayedSessions, getNotPayedSessions, deleteSessionById } = require('../controllers/session-controller');

//get all sessions from techerId
router.get('/teacher/:teacherId', getAllSessionsByTeacher);

//get todas las sessiones de un mismo estudiante
router.get('/student/:studentId', getSessionsByStudent);

//get by ID
router.get('/:id', getSessionById);

//get all payed session
router.get('/session-payed/:teacherId', getPayedSessions);

//get all not payed session
router.get('/session-not-payed/:teacherId', getNotPayedSessions);

//create new
router.post('/student-subject/:fkIdStudentSubject', addNewSession);

//update
router.put('/:id', updateSession);

//delete
router.delete('/:idSession', deleteSessionById);


module.exports = router;