const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

//importando controladores
const { getAllTeachers, getTeacherById, addNewTeacher, updateTeacher, teacherLogin, checkRepeatEmail } = require('../controllers/teacher-controllers');
//get
router.get('/', getAllTeachers);

//get by ID
router.get('/:id', getTeacherById);

//update
router.put('/:id',authenticateToken, updateTeacher);

//create new -- Register
router.post('/', addNewTeacher);

//login
router.post('/login', teacherLogin);

//chek repeat email
router.post('/check-email', checkRepeatEmail)

module.exports = router;