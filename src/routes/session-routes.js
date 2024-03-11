const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

//importando controladores
const { getAllSessionsByTeacher, getSessionsByStudent, getSessionById, addNewSession, updateSession, getPayedSessions, getNotPayedSessions, deleteSessionById } = require('../controllers/session-controller');

//get all sessions from techerId
router.get('/teacher/:teacherId', getAllSessionsByTeacher, authenticateToken);

//get todas las sessiones de un mismo estudiante
router.get('/student/:studentId', getSessionsByStudent, authenticateToken);

//get by ID
router.get('/:id', getSessionById, authenticateToken);

//get all payed session
router.get('/session-payed/:teacherId', getPayedSessions, authenticateToken);

//get all not payed session
router.get('/session-not-payed/:teacherId', getNotPayedSessions, authenticateToken);

//create new
router.post('/student-subject/:fkIdStudentSubject', addNewSession, authenticateToken);

//update
router.put('/:id', updateSession, authenticateToken);

//delete
router.delete('/:idSession', deleteSessionById, authenticateToken);


module.exports = router;