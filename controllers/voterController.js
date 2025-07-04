// controllers/voterController.js
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

exports.createVoter = async (req, res) => {
  const { name, email, dni } = req.body;

  try {
    // Verifica si el DNI ya está registrado como candidato
    const [candidateMatch] = await pool.query('SELECT * FROM Candidate WHERE DNI = ?', [dni]);
    if (candidateMatch.length > 0) {
      return res.status(400).json({ error: 'Este DNI ya está registrado como candidato.' });
    }

    // Verifica si el correo ya está registrado
    const [emailMatch] = await pool.query('SELECT * FROM Voter WHERE email = ?', [email]);
    if (emailMatch.length > 0) {
      return res.status(400).json({ error: 'Este email ya está registrado como votante.' });
    }

    // Inserta al nuevo votante
    const [result] = await pool.query(
      'INSERT INTO Voter (name, email, DNI) VALUES (?, ?, ?)',
      [name, email, dni]
    );

    res.status(201).json({
      message: 'Votante registrado correctamente',
      voter_id: result.insertId
    });
  } catch (err) {
    console.error('❌ Error al registrar votante:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getAllVoters = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, email } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM Voter WHERE 1=1';
    const params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }

    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [voters] = await pool.query(query, params);
    res.json(voters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getVoterById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM Voter WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Votante no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVoter = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Voter WHERE id = ?', [id]);
    res.json({ message: 'Votante eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginVoter = async (req, res) => {
  const { email, dni } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Voter WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Votante no encontrado' });
    }

    const voter = rows[0];
    if (voter.DNI !== dni) {
      return res.status(401).json({ error: 'DNI incorrecto' });
    }

    const token = jwt.sign(
      { id: voter.id, email: voter.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      voter: {
        id: voter.id,
        name: voter.name,
        email: voter.email,
        has_voted: voter.has_voted
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
