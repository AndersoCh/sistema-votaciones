// controllers/candidateController.js
const pool = require('../db');

exports.createCandidate = async (req, res) => {
  const { name, party, dni } = req.body;

  try {
    if (!name || !dni) {
      return res.status(400).json({ error: 'Nombre y DNI son obligatorios.' });
    }

    // Validar si ese DNI ya existe como votante
    const [voterMatch] = await pool.query('SELECT id FROM Voter WHERE DNI = ?', [dni]);
    if (voterMatch.length > 0) {
      return res.status(400).json({ error: 'Este DNI ya está registrado como votante.' });
    }

    // Validar si ya existe como candidato
    const [candidateMatch] = await pool.query('SELECT id FROM Candidate WHERE DNI = ?', [dni]);
    if (candidateMatch.length > 0) {
      return res.status(400).json({ error: 'Este candidato ya está registrado.' });
    }

    // Insertar candidato
    const [result] = await pool.query(
      'INSERT INTO Candidate (name, party, DNI) VALUES (?, ?, ?)',
      [name, party || null, dni]
    );

    res.status(201).json({
      message: 'Candidato registrado exitosamente',
      candidate_id: result.insertId
    });

  } catch (err) {
    console.error('❌ Error al registrar candidato:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.getAllCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, party } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM Candidate WHERE 1=1';
    const params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }

    if (party) {
      query += ' AND party LIKE ?';
      params.push(`%${party}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [candidates] = await pool.query(query, params);
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCandidateById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM Candidate WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Candidato no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Candidate WHERE id = ?', [id]);
    res.json({ message: 'Candidato eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
