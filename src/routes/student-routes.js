const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');


//importando controladores
const { getAllStudents, getStudentsByTeacher, getStudentById, addNewStudent, updateStudent, checkRepeatEmail, deleteStudentById } = require('../controllers/student-controller');

//get
router.get('/',authenticateToken, getAllStudents);

//get by teacher
router.get('/teacher/:teacherId',authenticateToken, getStudentsByTeacher)

//get by ID
router.get('/:id',authenticateToken, getStudentById);

//create new
router.post('/:teacherId',authenticateToken, addNewStudent);

//update
router.put('/:id',authenticateToken, updateStudent);

//chek repeat email
router.post('/check-email/:teacherId',authenticateToken, checkRepeatEmail);

//delete
router.delete('/:idStudent',authenticateToken, deleteStudentById);

module.exports = router;