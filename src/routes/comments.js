const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. POST /comments - Crear un comentario
router.post('/', async (req, res, next) => {
    const { content, post_id, author_id } = req.body;

    // Validación estricta
    if (!content || !content.trim() || !post_id || !author_id) {
        return res.status(400).json({ error: 'Contenido, post_id y author_id son obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO comments (content, post_id, author_id) VALUES ($1, $2, $3) RETURNING *',
            [content, post_id, author_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Manejo de error si el post o el autor no existen (Violación FK)
        if (error.code === '23503') {
            return res.status(404).json({ error: 'El post o el autor especificado no existe' });
        }
        next(error);
    }
});

// 2. GET /comments/post/:postId - Listar comentarios de un post específico
router.get('/post/:postId', async (req, res, next) => {
    const { postId } = req.params;

    try {
        // Ordenamos por fecha para que los más viejos salgan primero (como en un blog real)
        const result = await pool.query(
            'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC', 
            [postId]
        );
        
        // Aquí no devolvemos 404 si está vacío, porque un post puede existir y simplemente no tener comentarios aún.
        // Devolver un array vacío [] con 200 OK es la práctica correcta.
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
});

// 3. GET /comments - Listar todos los comentarios (General)
router.get('/', async (req, res, next) => {
    try {
        // Ordenamos por fecha descendente (los más nuevos primero)
        const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
        
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
})

module.exports = router;