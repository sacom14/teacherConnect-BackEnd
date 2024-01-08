const express = require('express');
const router = express.Router();

//importando controladores
const { getAllStudents, getStudentsByTeacher, getStudentById, addNewStudent, updateStudent } = require('../controllers/student-controller');

//get
router.get('/', getAllStudents);

//get by teacher
router.get('/teacher/:teacherId', getStudentsByTeacher)

//get by ID
router.get('/:id', getStudentById);


//create new
router.post('/', addNewStudent);

//update
router.put('/:id', updateStudent);

//delete
//falta si hace falta hacer toda la cascada de eliminar o no
module.exports = router;