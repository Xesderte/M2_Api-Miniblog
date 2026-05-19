require('dotenv').config(); // IMPORTANTE: Carga las variables del .env
const { Pool } = require('pg');

const pool = new Pool({
    // Prioriza DATABASE_URL (Railway), si no, construye la URL con las variables del .env
    connectionString: process.env.DATABASE_URL || 
        `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: {
        rejectUnauthorized: false // Necesario para el proxy de Railway
    }
});

module.exports = pool;