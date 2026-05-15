const { Pool } = require('pg');

// Usamos DATABASE_URL si existe (en Railway), de lo contrario usamos las variables individuales (local)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;