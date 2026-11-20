require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'techportfolio',
    connectionTimeoutMillis: 1200, // Timeout rápido para não travar a API se o PostgreSQL estiver desligado
});

pool.on('error', (err) => {
    // Ignora erros de conexão em segundo plano para permitir funcionamento via users.json
    console.warn('Aviso no pool do PostgreSQL:', err.message);
});

module.exports = pool;
