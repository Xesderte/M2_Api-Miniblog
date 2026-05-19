const express = require('express');
const cors = require('cors');
const pool = require('./db');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ status: 'ok', db_time: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ error: 'Fallo la conexión a la base de datos' });
    }
});

app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// Solo exportamos la app pura (Esto es vital para Supertest y Vitest)
module.exports = app;