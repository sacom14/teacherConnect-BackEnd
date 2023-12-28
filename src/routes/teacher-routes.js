const express = require('express');
const router = express.Router();

//importando controladores
const { getAllTeachers, getTeacherById, addNewTeacher, updateTeacher } = require('../controllers/teacher-controllers');
//get
router.get('/', getAllTeachers);

//get by ID
router.get('/:id', getTeacherById);

//create new
router.post('/', addNewTeacher);

//update
router.put('/:id', updateTeacher);

module.exports = router;