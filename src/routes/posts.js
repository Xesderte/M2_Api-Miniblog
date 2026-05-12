const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. GET /posts - Listar todos los posts
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// 2. GET /posts/author/:authorId - Obtener posts de un autor específico
router.get('/author/:authorId', async (req, res, next) => {
    const { authorId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM posts WHERE author_id = $1', [authorId]);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// 3. POST /posts - Crear un post
router.post('/', async (req, res, next) => {
    const { title, content, author_id, published } = req.body;
    
    if (!title || !content || !author_id) {
        return res.status(400).json({ error: 'Título, contenido y author_id son requeridos' });
    }

    try {
        const result = await pool.query(
        'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, author_id, published || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Si el author_id no existe en la tabla authors (Violación de Foreign Key)
        if (error.code === '23503') {
        return res.status(404).json({ error: 'El autor especificado no existe' });
        }
        next(error);
    }
});

// 4. PUT /posts/:id - Actualizar un post
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { title, content, published } = req.body;

    try {
        // Usamos COALESCE para actualizar solo los campos que nos envíen
        const result = await pool.query(
        `UPDATE posts 
        SET title = COALESCE($1, title), 
            content = COALESCE($2, content), 
            published = COALESCE($3, published) 
        WHERE id = $4 RETURNING *`,
        [title, content, published, id]
        );

        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// 5. DELETE /posts/:id - Borrar un post
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post no encontrado' });
        }
        res.json({ message: 'Post eliminado exitosamente', deleted: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

module.exports = router;