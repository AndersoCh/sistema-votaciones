// controllers/voteController.js
const pool = require('../db');

exports.castVote = async (req, res) => {
  const { voter_id, candidate_id } = req.body;
  try {
    const [[voter]] = await pool.query('SELECT * FROM Voter WHERE id = ?', [voter_id]);
    if (!voter) return res.status(404).json({ error: 'Votante no encontrado' });
    if (voter.has_voted) return res.status(400).json({ error: 'Este votante ya ha votado' });

    const [[candidate]] = await pool.query('SELECT * FROM Candidate WHERE id = ?', [candidate_id]);
    if (!candidate) return res.status(404).json({ error: 'Candidato no encontrado' });

    await pool.query('INSERT INTO Vote (voter_id, candidate_id) VALUES (?, ?)', [voter_id, candidate_id]);
    await pool.query('UPDATE Candidate SET votes = votes + 1 WHERE id = ?', [candidate_id]);
    await pool.query('UPDATE Voter SET has_voted = true WHERE id = ?', [voter_id]);

    res.status(201).json({ message: 'Voto registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllVotes = async (req, res) => {
  try {
    const [votes] = await pool.query('SELECT * FROM Vote');
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const [candidates] = await pool.query('SELECT id, name, votes FROM Candidate');
    const [totalVotesResult] = await pool.query('SELECT COUNT(*) AS total FROM Vote');
    const totalVotes = totalVotesResult[0].total;

    const statistics = candidates.map(candidate => {
      const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : 0;
      return {
        candidate_id: candidate.id,
        name: candidate.name,
        total_votes: candidate.votes,
        percentage: `${percentage}%`
      };
    });

    const [voters] = await pool.query('SELECT COUNT(*) AS voted FROM Voter WHERE has_voted = true');

    res.json({
      total_votes: totalVotes,
      statistics,
      total_voters_who_voted: voters[0].voted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
