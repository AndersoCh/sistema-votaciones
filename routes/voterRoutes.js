const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const voterController = require('../controllers/voterController');

router.get('/', verifyToken, voterController.getAllVoters); // ahora protegido
router.get('/:id', voterController.getVoterById); // GET /voters/:id
router.delete('/:id', voterController.deleteVoter); // DELETE /voters/:id
router.post('/login', voterController.loginVoter); // POST /voters/login
router.post('/', voterController.createVoter);

module.exports = router;
