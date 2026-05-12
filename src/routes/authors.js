const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. GET /authors - Listar todos los autores
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM authors ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        next(error); // Pasa el error al manejador central de app.js
    }
});

// 2. GET /authors/:id - Obtener un autor específico
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// 3. POST /authors - Crear un nuevo autor
router.post('/', async (req, res, next) => {
    const { name, email, bio } = req.body;
    
    // Validación básica requerida por la consigna
    if (!name || !email) {
        return res.status(400).json({ error: 'El nombre y el email son obligatorios' });
    }

    try {
        const result = await pool.query(
        'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
        [name, email, bio || null]
        );
        res.status(201).json(result.rows[0]); // 201 Created
    } catch (error) {
        // Manejo específico si el email ya existe (Violación UNIQUE en Postgres = 23505)
        if (error.code === '23505') {
        return res.status(409).json({ error: 'Este email ya está registrado' });
        }
        next(error);
    }
});

// 4. DELETE /authors/:id - Borrar un autor
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json({ message: 'Autor eliminado exitosamente', deleted: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

module.exports = router;