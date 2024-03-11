const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');


//importando controladores
const { getAllSubjects, getSubjectById} = require('../controllers/subject-controller');
//get
router.get('/', getAllSubjects, authenticateToken);

//get by ID
router.get('/:id', getSubjectById, authenticateToken);

module.exports = router;