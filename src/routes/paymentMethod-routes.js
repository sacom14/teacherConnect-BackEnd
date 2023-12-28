const express = require('express');
const router = express.Router();

//importando controladores
const { getAllPaymentMethods, getPaymentMethodById} = require('../controllers/paymentMethod-controller');
//get
router.get('/', getAllPaymentMethods);

//get by ID
router.get('/:id', getPaymentMethodById);

module.exports = router;