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
    
    // Validación estricta: evita campos vacíos o llenos de espacios
    if (!name || !name.trim() || !email || !email.trim()) {
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


// 5. PUT /authors/:id - Actualizar un autor
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    // Validación para la actualización de autor
    if (name !== undefined && name.trim() === '') {
        return res.status(400).json({ error: 'El nombre no puede quedar vacío' });
    }
    if (email !== undefined && email.trim() === '') {
        return res.status(400).json({ error: 'El email no puede quedar vacío' });
    }

    try {
        const result = await pool.query(
        `UPDATE authors 
            SET name = COALESCE($1, name), 
                email = COALESCE($2, email), 
                bio = COALESCE($3, bio) 
            WHERE id = $4 RETURNING *`,
            [name, email, bio, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }
        
        res.json(result.rows[0]); // Devuelve el autor actualizado con un 200 OK
    } catch (error) {
        // Validación técnica: Si intentan cambiar el email por uno que ya existe
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Este email ya está registrado por otro usuario' });
        }
        next(error);
    }
});


module.exports = router;