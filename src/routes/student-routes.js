const express = require('express');
const router = express.Router();

//importando controladores
const { getAllStudents, getStudentsByTeacher, getStudentById, addNewStudent, updateStudent, checkRepeatEmail } = require('../controllers/student-controller');

//get
router.get('/', getAllStudents);

//get by teacher
router.get('/teacher/:teacherId', getStudentsByTeacher)

//get by ID
router.get('/:id', getStudentById);


//create new
router.post('/:teacherId', addNewStudent);

//update
router.put('/:id', updateStudent);

//chek repeat email
router.post('/check-email/:teacherId', checkRepeatEmail)


//delete
//falta si hace falta hacer toda la cascada de eliminar o no
module.exports = router;