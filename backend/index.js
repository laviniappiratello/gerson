require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Função de inicialização corrigida
async function inicializarBancoDeDados() {
  try {
    console.log('🔮 Verificando tabelas no Render...');
    
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
        created_at BIGINT, 
        updated_at BIGINT
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
        created_at BIGINT,
        favorite BOOLEAN DEFAULT FALSE,
        updated_at BIGINT
      );
    `);
    console.log('Tabelas verificadas/criadas com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar tabelas:', err.message);
  }
}
app.get('/sync', async (req, res) => {
  const lastPulledAt = parseInt(req.query.lastPulledAt);
  try {
    const users = await pool.query('SELECT * FROM users WHERE updated_at > $1', [lastPulledAt]);
    const readings = await pool.query('SELECT * FROM readings WHERE updated_at > $1', [lastPulledAt]);
    res.json({
      changes: {
        users: { created: users.rows, updated: [], deleted: [] },
        readings: { created: readings.rows, updated: [], deleted: [] }
      },
      timestamp: Date.now()
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/sync', async (req, res) => {
  const { changes } = req.body;
  const serverTimestamp = Date.now();
  // Aqui você faria os INSERTs ou UPDATEs no Postgres com base no objeto 'changes'
  res.json({ status: 'ok', timestamp: serverTimestamp });
});
// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor Persefone está online!');
});

// Sincronização e outros endpoints...
// [Adicione seus app.get('/sync') e app.post('/sync') aqui]

// Inicializa o banco e sobe o servidor
inicializarBancoDeDados().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}!`);
  });
});