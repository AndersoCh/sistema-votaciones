const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const verifyToken = require('../middleware/verifyToken');

// NO LLAMES las funciones con paréntesis
router.post('/', verifyToken, candidateController.createCandidate);
router.get('/', verifyToken, candidateController.getAllCandidates);
router.get('/:id', verifyToken, candidateController.getCandidateById);
router.delete('/:id', verifyToken, candidateController.deleteCandidate);

module.exports = router;
