const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido al sistema de votaciones! 🗳️');
});

app.post('/login', async (req, res) => {
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

    res.status(200).json({
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
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

const voterRoutes = require('./routes/voterRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/candidates', candidateRoutes);
const voteRoutes = require('./routes/voteRoutes');

app.use('/voters', voterRoutes);     
app.use('/candidates', candidateRoutes);
app.use('/votes', voteRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
});
