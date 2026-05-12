-- Borrar tablas si existen (para poder reiniciar el script)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

-- 1. Crear tabla de autores
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla de posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Relación: Si se borra un autor, se borran sus posts (CASCADE)
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- 3. Cargar datos de prueba (Seed)
INSERT INTO authors (name, email, bio) VALUES
('Ana Dev', 'ana@devspark.com', 'Backend Developer Jr'),
('Nico Code', 'nico@devspark.com', 'Entusiasta de PostgreSQL');

INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Mi primer post', 'Este es el contenido del post de Ana', true),
(2, 'Post de prueba', 'Contenido del post de Nico', false);