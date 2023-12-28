const express = require('express');
const router = express.Router();

//importando controladores
const { getAllAcademicYears, getAcademicYeartById} = require('../controllers/academicYear-controller');
//get
router.get('/', getAllAcademicYears);

//get by ID
router.get('/:id', getAcademicYeartById);

module.exports = router;