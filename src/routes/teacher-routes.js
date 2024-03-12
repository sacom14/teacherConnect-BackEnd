const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

//importando controladores
const { getAllTeachers, getTeacherById, addNewTeacher, updateTeacher, teacherLogin, checkRepeatEmail, deleteTeacherById } = require('../controllers/teacher-controllers');
//get
router.get('/', getAllTeachers);

//get by ID
router.get('/:id', getTeacherById );

//update
router.put('/:idTeacher', updateTeacher, authenticateToken);

//create new -- Register
router.post('/', addNewTeacher);

//login
router.post('/login', teacherLogin);

//chek repeat email
router.post('/check-email/:idTeacher', checkRepeatEmail);

//delete
router.delete('/:idTeacher', deleteTeacherById, authenticateToken);

module.exports = router;