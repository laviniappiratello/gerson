async function inicializarBancoDeDados() {
  try {
    console.log('🔮 Verificando e garantindo tabelas no Render...');
    
    // Adicionando created_at que faltava na tabela users
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
        created_at BIGINT NOT NULL, 
        updated_at BIGINT NOT NULL
      );
    `);

    // A tabela readings já parece estar completa com created_at e updated_at
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
    console.log('Tabelas estruturadas com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar:', err.message);
  }
}