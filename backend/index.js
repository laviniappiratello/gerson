require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Obrigatório para rodar no Render
});

async function inicializarBancoDeDados() {
  try {
    console.log('🔮 Verificando e criando tabelas no Render...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        birth_date VARCHAR(255) NOT NULL,
        signo VARCHAR(255) NOT NULL,
        arcano VARCHAR(255) NOT NULL,
        biometrics_enabled BOOLEAN DEFAULT FALSE,
        updated_at BIGINT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS readings (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        cards TEXT NOT NULL,
        deck_id VARCHAR(255) NOT NULL,
        card_count INT NOT NULL,
        note TEXT DEFAULT '',
        created_at BIGINT NOT NULL,
        favorite BOOLEAN DEFAULT FALSE,
        updated_at BIGINT NOT NULL
      );
    `);

    console.log('Tabelas estruturadas com sucesso no Render!');
  } catch (err) {
    console.error('Erro ao inicializar tabelas:', err.message);
  }
}

inicializarBancoDeDados();

app.get('/sync', async (req, res) => {
  const lastPulledAt = req.query.lastPulledAt || 0;
  try {
    const usersResult = await pool.query('SELECT * FROM users WHERE updated_at > $1', [lastPulledAt]);
    const readingsResult = await pool.query('SELECT * FROM readings WHERE updated_at > $1', [lastPulledAt]);

    res.json({
      changes: {
        users: { created: usersResult.rows, updated: [], deleted: [] },
        readings: { created: readingsResult.rows, updated: [], deleted: [] }
      },
      timestamp: Date.now()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/sync', async (req, res) => {
  const { changes } = req.body;
  const serverTimestamp = Date.now();

  try {
    if (changes.users?.created) {
      for (const u of changes.users.created) {
        await pool.query(
          `INSERT INTO users (id, name, email, password, birth_date, signo, arcano, biometrics_enabled, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
           ON CONFLICT (email) DO UPDATE SET name=$2, password=$4, updated_at=$9`,
          [u.id, u.name, u.email, u.password, u.birth_date, u.signo, u.arcano, u.biometrics_enabled, serverTimestamp]
        );
      }
    }

    if (changes.readings?.created) {
      for (const r of changes.readings.created) {
        await pool.query(
          `INSERT INTO readings (id, user_id, question, cards, deck_id, card_count, note, created_at, favorite, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [r.id, r.user_id, r.question, r.cards, r.deck_id, r.card_count, r.note, r.created_at, r.favorite, serverTimestamp]
        );
      }
    }

    res.json({ status: 'ok', timestamp: serverTimestamp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Servidor Persefone rodando na porta ${PORT}!`));