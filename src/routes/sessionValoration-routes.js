const express = require('express');
const router = express.Router();

//importando controladores
const { getSessionValorationBySession, getSessionValorationById, addNewSessionValoration, updateSessionValoration } = require('../controllers/sessionValoration-controller');

//get valoración de la session
router.get('/session/:sessionId', getSessionValorationBySession);

//get by ID
router.get('/:id', getSessionValorationById);

//create new
router.post('/session/:id_session', addNewSessionValoration);

//update
router.put('/:id', updateSessionValoration);

module.exports = router;