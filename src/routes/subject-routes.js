const express = require('express');
const router = express.Router();

//importando controladores
const { getAllSubjects, getSubjectById} = require('../controllers/subject-controller');
//get
router.get('/', getAllSubjects);

//get by ID
router.get('/:id', getSubjectById);

module.exports = router;