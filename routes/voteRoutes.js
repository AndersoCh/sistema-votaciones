const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

router.post('/', voteController.castVote); // POST /votes
router.get('/', voteController.getAllVotes); // GET /votes
router.get('/statistics', voteController.getStatistics); // GET /votes/statistics

module.exports = router;
