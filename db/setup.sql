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

-- 3. Crear tabla de comentarios (opcional, para mostrar relaciones más complejas)
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cargar datos de prueba (Seed)
INSERT INTO authors (name, email, bio) VALUES
('Ana Dev', 'ana@devspark.com', 'Backend Developer Jr'),
('Nico Code', 'nico@devspark.com', 'Entusiasta de PostgreSQL');

INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Mi primer post', 'Este es el contenido del post de Ana', true),
(2, 'Post de prueba', 'Contenido del post de Nico', false);

INSERT INTO comments (content, post_id, author_id) VALUES 
    ('¡Excelente artículo! Me sirvió muchísimo para entender el tema.', 1, 2),
    ('Tengo una duda con el segundo párrafo, ¿podrías dar otro ejemplo?', 5, 3),
    ('¡Qué buen post! Totalmente de acuerdo con tu punto de vista.', 4, 1);