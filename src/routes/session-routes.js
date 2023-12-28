const express = require('express');
const router = express.Router();

//importando controladores
const { getSessionsByStudent, getSessionById, addNewSession, updateSession } = require('../controllers/session-controller');

//get todas las sessiones de un mismo estudiante
router.get('/student/:studentId', getSessionsByStudent);

//get by ID
router.get('/:id', getSessionById);

//create new
router.post('/student-subject/:id_student_subject', addNewSession);

//update
router.put('/:id', updateSession);

module.exports = router;