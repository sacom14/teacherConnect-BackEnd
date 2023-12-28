const express = require('express');
const router = express.Router();

//importando controladores
const { getAllStudents, getStudentById, addNewStudent, updateStudent } = require('../controllers/student-controller');

//get
router.get('/', getAllStudents);

//get by ID
router.get('/:id', getStudentById);


//create new
router.post('/', addNewStudent);

//update
router.put('/:id', updateStudent);

//delete
//falta si hace falta hacer toda la cascada de eliminar o no
module.exports = router;